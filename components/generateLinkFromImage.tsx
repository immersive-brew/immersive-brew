'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Import createClient
import GenerateImage from './generateImage';

export default function GenerateLinkFromImage() {
  const [imageLink, setImageLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false); // State for copy notification

  // Initialize Supabase client within the component
  const supabase = createClient();

  // Fetch the user ID when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
      } else if (user) {
        setUserId(user.id);
      } else {
        console.log('No user is signed in');
        // Optionally, redirect to sign-in page or prompt user to sign in
      }
    };

    fetchUserId();
  }, [supabase]);

  const handleImageGenerated = (imageUrl: string) => {
    console.log('Image data received in parent:', imageUrl);
    setImageData(imageUrl);
    setCopySuccess(false); // Reset copy success state when a new image is generated
  };

  // Function to convert base64 data URL to Blob
  function dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const handleUpload = async () => {
    if (!imageData) {
      console.error('No image data to upload');
      return;
    }

    if (!userId) {
      console.error('No user is signed in');
      // Optionally, prompt the user to sign in
      return;
    }

    setLoading(true);
    setCopySuccess(false); // Reset copy success state before starting a new upload

    try {
      // Convert base64 data URL to Blob
      const blob = dataURLtoBlob(imageData);

      // Generate a unique filename
      const filename = `${userId}-${Date.now()}.png`;

      // Upload the image to Supabase Storage
      const { data, error } = await supabase.storage
        .from('generated-images') // Replace with your actual bucket name
        .upload(filename, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/png',
        });

      if (error) {
        console.error('Error uploading image:', error.message);
      } else {
        // Get the public URL of the uploaded image
        const { data: publicData, error: publicUrlError } = supabase.storage
          .from('generated-images')
          .getPublicUrl(filename);

        if (publicUrlError) {
          console.error('Error getting public URL:', publicUrlError.message);
        } else {
          setImageLink(publicData.publicUrl);
          console.log('Image uploaded successfully:', publicData.publicUrl);

          // Copy the link to the clipboard
          try {
            await navigator.clipboard.writeText(publicData.publicUrl);
            setCopySuccess(true);
            console.log('Image link copied to clipboard.');
          } catch (clipboardError) {
            console.error('Failed to copy image link to clipboard:', clipboardError);
          }
        }
      }
    } catch (error) {
      console.error('Error during the upload:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <GenerateImage onImageGenerated={handleImageGenerated} />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        disabled={!imageData || loading || !userId}
      >
        {loading ? 'Uploading...' : 'Upload Image to Supabase'}
      </button>

      {copySuccess && (
        <div className="text-green-600 mb-4">
          Image link has been copied to your clipboard!
        </div>
      )}

      {imageLink && (
        <div>
          <p>Image successfully uploaded!</p>
          <a href={imageLink} target="_blank" rel="noopener noreferrer">
            Click here to view the image
          </a>
        </div>
      )}
    </div>
  );
}

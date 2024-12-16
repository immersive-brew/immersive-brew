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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <GenerateImage onImageGenerated={handleImageGenerated} />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className={`w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-300 
          ${(!imageData || loading || !userId) ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!imageData || loading || !userId}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Uploading...
          </div>
        ) : (
          'Upload Image to Supabase'
        )}
      </button>

      {/* Copy Success Notification */}
      {copySuccess && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center justify-between">
          <span>Image link has been copied to your clipboard!</span>
          <svg
            className="w-5 h-5 text-green-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Image Link Display */}
      {imageLink && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between">
          <span className="text-blue-700 font-medium">Image successfully uploaded!</span>
          <a
            href={imageLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            View Image
            <svg
              className="w-4 h-4 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

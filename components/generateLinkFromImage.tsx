"use client";
import { useState } from 'react';
import GenerateImage from './generateImage';

export default function GenerateLinkFromImage() {
  const [imageLink, setImageLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null); // Store image base64 data

  const handleImageGenerated = async (imageUrl: string) => {
    console.log('Image data received in parent:', imageUrl); // Log image data here
    setImageData(imageUrl); // Store the base64 image data
  };

  const handleUpload = async () => {
    if (!imageData) {
      console.error('No image data to upload');
      return;
    }

    setLoading(true);
    
    const userId = "your-user-id"; // Use the correct userId from your auth context or state

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData, userId }),
      });

      const result = await response.json();
      if (response.ok) {
        setImageLink(result.url);
        console.log('Image uploaded successfully:', result.url);
      } else {
        console.error('Error uploading image:', result.error);
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
        disabled={!imageData || loading} // Disable button if no image or still loading
      >
        {loading ? 'Uploading...' : 'Upload Image to Supabase'}
      </button>

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

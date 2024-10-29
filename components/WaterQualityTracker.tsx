// components/WaterQualityTracker.tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function WaterQualityTracker() {
  const [sampleImageLink, setSampleImageLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sampleData, setSampleData] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch the user ID when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error('Error fetching user:', error.message);
      else if (user) setUserId(user.id);
      else console.log('No user signed in');
    };

    fetchUserId();
  }, [supabase]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSampleData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Convert base64 data URL to Blob
  function dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error('Invalid data URL');
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
  }

  const handleUpload = async () => {
    if (!sampleData) {
      console.error('No sample data to upload');
      return;
    }
    if (!userId) {
      console.error('No user signed in');
      return;
    }

    setLoading(true);
    setCopySuccess(false);

    try {
      const blob = dataURLtoBlob(sampleData);
      const filename = `${userId}-sample-${Date.now()}.png`;

      const { data, error } = await supabase.storage
        .from('water-quality-samples')
        .upload(filename, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/png',
        });

      if (error) console.error('Error uploading sample:', error.message);
      else {
        const { data: publicData, error: publicUrlError } = supabase.storage
          .from('water-quality-samples')
          .getPublicUrl(filename);

        if (publicUrlError) {
          console.error('Error getting public URL:', publicUrlError.message);
        } else {
          setSampleImageLink(publicData.publicUrl);
          console.log('Sample uploaded successfully:', publicData.publicUrl);

          // Simulate water analysis
          setAnalysisResult('Water sample contains trace levels of iron, calcium, and magnesium.');

          try {
            await navigator.clipboard.writeText(publicData.publicUrl);
            setCopySuccess(true);
            console.log('Sample link copied to clipboard.');
          } catch (clipboardError) {
            console.error('Failed to copy sample link:', clipboardError);
          }
        }
      }
    } catch (error) {
      console.error('Error during upload:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={!sampleData || loading || !userId}
      >
        {loading ? 'Uploading...' : 'Upload Water Sample'}
      </button>

      {copySuccess && (
        <div className="text-green-600 mb-4">
          Sample link has been copied to your clipboard!
        </div>
      )}

      {sampleImageLink && (
        <div>
          <p>Sample successfully uploaded!</p>
          <a href={sampleImageLink} target="_blank" rel="noopener noreferrer">
            View Sample
          </a>
          {analysisResult && (
            <div className="mt-4">
              <p><strong>Analysis Result:</strong> {analysisResult}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

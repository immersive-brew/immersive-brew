'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

type JournalEntryType = {
  id: number;
  created_at: string;
  temperature?: number;
  coffee_weight?: number;
  water_weight?: number;
  grind_setting?: string;
  overall_time?: number;
};

interface GenerateImageProps {
  onImageGenerated: (imageUrl: string) => void;
}

export default function GenerateImage({ onImageGenerated }: GenerateImageProps) {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch the user ID on mount
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
      }
    };

    fetchUserId();
  }, [supabase]);

  // Fetch all journal entries for this user
  const fetchEntries = async () => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('entries')
      .select('id, created_at, temperature, coffee_weight, water_weight, grind_setting, overall_time')
      .eq('userid', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
    } else if (data && data.length > 0) {
      console.log('Fetched entries:', data);
      setEntries(data);
      setSelectedEntryId(data[0].id); // Select the latest entry by default
    } else {
      console.warn('No entries found in the database');
      setEntries([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [userId]); // Refetch when userId is set

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImageUrl(imageUrl);
    }
  };

  const generateImageWithText = () => {
    if (!canvasRef.current) {
      console.error('Canvas not available.');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get 2D context.');
      return;
    }

    const entry = entries.find((e) => e.id === selectedEntryId);
    if (!entry) {
      console.error('Selected entry not found.');
      return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Choose a random background color
    const colors = ['#fff8e1', '#e1f5fe', '#f1f8e9', '#fce4ec', '#e8f5e9', '#fff3e0'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add Header Rectangle
    ctx.fillStyle = '#006064';
    ctx.fillRect(0, 0, canvas.width, 60);

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Coffee Journal Entry', canvas.width / 2, 35);

    // Add Decorative Line
    ctx.strokeStyle = '#004d40';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 70);
    ctx.lineTo(canvas.width - 20, 70);
    ctx.stroke();

    // Define Text Properties for entry details
    ctx.font = '18px Arial';
    ctx.fillStyle = '#004d40';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    const padding = 20;
    const lineHeight = 30;
    let yPosition = 100;

    // Display Journal Entry Data
    ctx.fillText(`Entry Date: ${formatDateTime(entry.created_at)}`, padding, yPosition);
    yPosition += lineHeight;
    ctx.fillText(`Temperature: ${entry.temperature !== undefined ? `${entry.temperature}°C` : 'N/A'}`, padding, yPosition);
    yPosition += lineHeight;
    ctx.fillText(`Coffee Weight: ${entry.coffee_weight !== undefined ? `${entry.coffee_weight}g` : 'N/A'}`, padding, yPosition);
    yPosition += lineHeight;
    ctx.fillText(`Water Weight: ${entry.water_weight !== undefined ? `${entry.water_weight}g` : 'N/A'}`, padding, yPosition);
    yPosition += lineHeight;
    ctx.fillText(`Grind Setting: ${entry.grind_setting || 'N/A'}`, padding, yPosition);
    yPosition += lineHeight;
    ctx.fillText(`Overall Time: ${entry.overall_time !== undefined ? formatTime(entry.overall_time) : 'N/A'}`, padding, yPosition);

    if (userImageUrl) {
      const uploadedImg = new Image();
      uploadedImg.src = userImageUrl;

      uploadedImg.onload = () => {
        const maxSize = 100; // Maximum dimension for the user's image
        const ratio = Math.min(maxSize / uploadedImg.width, maxSize / uploadedImg.height);
        
        // Only scale down if image is larger than maxSize
        const drawWidth = uploadedImg.width * (ratio < 1 ? ratio : 1);
        const drawHeight = uploadedImg.height * (ratio < 1 ? ratio : 1);

        // Draw the user's uploaded image in the bottom-right corner
        ctx.drawImage(
          uploadedImg, 
          canvas.width - drawWidth - padding, 
          canvas.height - drawHeight - padding,
          drawWidth,
          drawHeight
        );

        // Generate image after all drawings are done
        const imageUrl = canvas.toDataURL('image/png');
        onImageGenerated(imageUrl);
      };

      uploadedImg.onerror = () => {
        console.warn('Failed to load the uploaded image. Generating without it.');
        const imageUrl = canvas.toDataURL('image/png');
        onImageGenerated(imageUrl);
      };
    } else {
      // No uploaded image, just generate the image
      const imageUrl = canvas.toDataURL('image/png');
      onImageGenerated(imageUrl);
    }
  };

  if (loading) {
    return <div>Loading journal entries...</div>;
  }

  if (entries.length === 0) {
    return <div>No journal entries available.</div>;
  }

  return (
    <div>
      {/* Dropdown to Select Journal Entry */}
      <div className="mb-4">
        <label htmlFor="entry-select" className="block mb-2 font-semibold text-gray-700">
          Select Journal Entry:
        </label>
        <select
          id="entry-select"
          value={selectedEntryId || ''}
          onChange={(e) => setSelectedEntryId(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {entries.map((entry) => {
            const formattedDateTime = formatDateTime(entry.created_at);
            return (
              <option key={entry.id} value={entry.id}>
                {formattedDateTime}
              </option>
            );
          })}
        </select>
      </div>

      {/* File Input for Uploading an Image */}
      <div className="mb-4">
        <label htmlFor="image-upload" className="block mb-1 font-semibold text-gray-700">
          Upload an Image (optional):
        </label>
        <span className="text-sm text-gray-500">For best results, use an image at least 100x100px.</span>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full mt-2"
        />
      </div>

      {/* Canvas to Generate Image */}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}
      />

      {/* Generate Image Button */}
      <button
        onClick={generateImageWithText}
        className="mb-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Generate Image with Selected Journal Entry
      </button>
    </div>
  );
}

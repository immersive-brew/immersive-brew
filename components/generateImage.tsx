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

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch all journal entries from the database
  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entries')
      .select('id, created_at, temperature, coffee_weight, water_weight, grind_setting, overall_time')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
    } else if (data && data.length > 0) {
      console.log('Fetched entries:', data);
      setEntries(data);
      setSelectedEntryId(data[0].id); // Select the latest entry by default
    } else {
      console.warn('No entries found in the database');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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

    // Set canvas background with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#e0f7fa');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add Header
    ctx.fillStyle = '#006064';
    ctx.fillRect(0, 0, canvas.width, 60);

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Coffee Journal Entry', canvas.width / 2, 35);

    // Add Decorative Line
    ctx.strokeStyle = '#004d40';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 70);
    ctx.lineTo(canvas.width - 20, 70);
    ctx.stroke();

    // Define Text Properties
    ctx.font = '18px Arial';
    ctx.fillStyle = '#004d40';
    ctx.textAlign = 'left';

    const padding = 20;
    const lineHeight = 30;
    let yPosition = 100;

    // Display Journal Entry Data
    ctx.fillText(`Entry Date: ${new Date(entry.created_at).toLocaleDateString()}`, padding, yPosition);
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

    // Optionally, add an icon from the public folder
    const icon = new Image();
    icon.src = '/coffee-icon.png'; // Ensure this image exists in your public folder
    icon.onload = () => {
      const iconSize = 50;
      ctx.drawImage(icon, canvas.width - iconSize - padding, padding, iconSize, iconSize);

      // Generate image after all drawings are done
      const imageUrl = canvas.toDataURL('image/png'); // Keep the full data URL
      onImageGenerated(imageUrl); // Pass the image data URL to the parent component
    };

    // If the icon fails to load, still generate the image
    icon.onerror = () => {
      console.warn('Coffee icon not found. Generating image without icon.');
      const imageUrl = canvas.toDataURL('image/png'); // Keep the full data URL
      onImageGenerated(imageUrl); // Pass the image data URL to the parent component
    };
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
          {entries.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {new Date(entry.created_at).toLocaleDateString()} - ID: {entry.id}
            </option>
          ))}
        </select>
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

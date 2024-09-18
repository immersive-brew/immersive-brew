"use client";
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

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
  const [entry, setEntry] = useState<JournalEntryType | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch the first journal entry from the database
  const fetchFirstEntry = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entries')
      .select('id, created_at, temperature, coffee_weight, water_weight, grind_setting, overall_time')
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching journal entry:', error);
    } else if (data && data.length > 0) {
      console.log('Fetched entry:', data[0]);
      setEntry(data[0]);
    } else {
      console.warn('No entries found in the database');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFirstEntry();
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

    console.log('Canvas and 2D context available.');

    // Set canvas background color
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';

    if (!entry) {
      console.error('Entry data not available.');
      return;
    }

    // Display the journal entry data on the image
    ctx.fillText(`Entry Date: ${new Date(entry.created_at).toLocaleDateString()}`, 10, 30);
    ctx.fillText(`Temperature: ${entry.temperature !== undefined ? `${entry.temperature}°C` : 'N/A'}`, 10, 60);
    ctx.fillText(`Coffee Weight: ${entry.coffee_weight !== undefined ? `${entry.coffee_weight}g` : 'N/A'}`, 10, 90);
    ctx.fillText(`Water Weight: ${entry.water_weight !== undefined ? `${entry.water_weight}g` : 'N/A'}`, 10, 120);
    ctx.fillText(`Grind Setting: ${entry.grind_setting || 'N/A'}`, 10, 150);
    ctx.fillText(`Overall Time: ${entry.overall_time !== undefined ? formatTime(entry.overall_time) : 'N/A'}`, 10, 180);
    console.log('Journal entry data drawn on canvas.');

    // Convert the canvas to an image and store the base64 string in imageSrc
    const imageUrl = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, ''); // Remove prefix for base64
    onImageGenerated(imageUrl); // Pass the image base64 to the parent component
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={250} style={{ border: '1px solid black', marginBottom: '20px' }} />

      <button onClick={generateImageWithText} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        Generate Image with Journal Entry Data
      </button>
    </div>
  );
}

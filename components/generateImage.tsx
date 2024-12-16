'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

type RecipeType = {
  id: number;
  name: string;
  description?: string; // Add other recipe-related fields as needed
};

type JournalEntryType = {
  id: number;
  created_at: string;
  temperature?: number;
  coffee_weight?: number;
  water_weight?: number;
  grind_setting?: string;
  overall_time?: number;
  brew_tools?: string[]; // Brewing tools as an array
  recipes?: RecipeType; // Nested recipe data
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
  const supabase = createClient();

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
      .select(`
        id,
        created_at,
        temperature,
        coffee_weight,
        water_weight,
        grind_setting,
        overall_time,
        brew_tools,
        recipes ( id, name, description ) // Fetch related recipe data
      `)
      .eq('userid', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
    } else if (data && data.length > 0) {
      console.log('Fetched entries:', data);
      setEntries(data as JournalEntryType[]);
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
      const reader = new FileReader();
      reader.onload = () => {
        setUserImageUrl(reader.result as string);
        console.log('Image uploaded and set:', reader.result);
      };
      reader.onerror = (error) => {
        console.error('Error reading the image file:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  const getBrewTools = (brew_tools?: string[] | string): string[] => {
    if (Array.isArray(brew_tools)) {
      return brew_tools;
    } else if (typeof brew_tools === 'string') {
      try {
        const parsed = JSON.parse(brew_tools);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing brew_tools:', e);
      }
    }
    return [];
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

    // Define colors based on JournalEntry component
    const headerColor = '#f3f4f6'; // Tailwind's bg-gray-100
    const textColor = '#374151'; // Tailwind's text-gray-700
    const labelColor = '#6b7280'; // Tailwind's text-gray-500
    const lineColor = '#9ca3af'; // Tailwind's text-gray-400

    // Fill background
    ctx.fillStyle = '#ffffff'; // White background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add Header Rectangle
    ctx.fillStyle = headerColor;
    ctx.fillRect(0, 0, canvas.width, 60);

    // Header Text
    ctx.font = 'bold 28px Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Coffee Journal Entry', canvas.width / 2, 30);

    // Add Decorative Line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 65);
    ctx.lineTo(canvas.width - 20, 65);
    ctx.stroke();

    // Define Text Properties for entry details
    ctx.font = '16px Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const padding = 20;
    const labelX = padding;
    const valueX = canvas.width / 2 + padding;
    let yPosition = 80;
    const lineHeight = 25;

    // Helper to draw labels and values
    const drawLabelValue = (label: string, value: string, y: number) => {
      ctx.fillStyle = labelColor;
      ctx.fillText(label, labelX, y);
      ctx.fillStyle = textColor;
      ctx.fillText(value, valueX, y);
    };

    // Display Journal Entry Data
    drawLabelValue('Entry Date:', formatDateTime(entry.created_at), yPosition);
    yPosition += lineHeight;
    drawLabelValue(
      'Temperature:',
      entry.temperature !== undefined ? `${entry.temperature}°C` : 'N/A',
      yPosition
    );
    yPosition += lineHeight;
    drawLabelValue(
      'Coffee Weight:',
      entry.coffee_weight !== undefined ? `${entry.coffee_weight}g` : 'N/A',
      yPosition
    );
    yPosition += lineHeight;
    drawLabelValue(
      'Water Weight:',
      entry.water_weight !== undefined ? `${entry.water_weight}g` : 'N/A',
      yPosition
    );
    yPosition += lineHeight;
    drawLabelValue('Grind Setting:', entry.grind_setting || 'N/A', yPosition);
    yPosition += lineHeight;
    drawLabelValue(
      'Overall Time:',
      entry.overall_time !== undefined ? formatTime(entry.overall_time) : 'N/A',
      yPosition
    );
    yPosition += lineHeight;

    // Brewing Tools (Conditional)
    const brewTools = getBrewTools(entry.brew_tools);
    if (brewTools.length > 0) {
      ctx.fillStyle = labelColor;
      ctx.fillText('Brewing Tools:', labelX, yPosition);
      ctx.fillStyle = textColor;
      brewTools.forEach((tool, index) => {
        ctx.fillText(`• ${tool}`, valueX, yPosition + index * lineHeight);
      });
      yPosition += brewTools.length * lineHeight;
    }

    // Recipe Name
    ctx.fillStyle = labelColor;
    ctx.fillText('Recipe:', labelX, yPosition);
    ctx.fillStyle = textColor;
    ctx.fillText(entry.recipes?.name || 'N/A', valueX, yPosition);
    yPosition += lineHeight;

    // Optional User Image
    if (userImageUrl) {
      const uploadedImg = new Image();
      uploadedImg.src = userImageUrl;

      uploadedImg.onload = () => {
        console.log('User image loaded successfully.');
        const maxSize = 100; // Maximum dimension for the user's image
        const ratio = Math.min(maxSize / uploadedImg.width, maxSize / uploadedImg.height);

        // Calculate dimensions while preserving aspect ratio
        const drawWidth = uploadedImg.width * ratio;
        const drawHeight = uploadedImg.height * ratio;

        // Draw the user's uploaded image in the bottom-right corner without stretching
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
        console.log('Image generated with user image.');
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
      console.log('Image generated without user image.');
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
        style={{ border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '20px' }}
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

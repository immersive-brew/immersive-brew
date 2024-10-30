'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function WaterQualityTracker() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedWaterType, setSelectedWaterType] = useState<string | null>(null);
  const [packetCount, setPacketCount] = useState<number | null>(null);
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

  // Water types to track
  const waterTypes = [
    'Third Wave Water (light roast profile)',
    'Coffee Water',
    'gcwater',
    'Aquacode',
    'Perfect Coffee Water',
    'Custom Water',
  ];

  // Handle water type selection
  const handleWaterChoice = (waterType: string) => {
    setSelectedWaterType(waterType);
    setPacketCount(null); // Reset packet count when a new water type is selected
  };

  // Handle submission of water type and packet count to Supabase
  const handleSubmit = async () => {
    if (!userId) {
      setMessage('Please log in to track water choices.');
      return;
    }
    if (!selectedWaterType || packetCount === null) {
      setMessage('Please select a water type and packet count.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('water_tracker')
      .insert([{ user_id: userId, water_type: selectedWaterType, packet_count: packetCount, date: new Date() }]);
    
    if (error) {
      console.error('Error uploading data:', error.message);
      setMessage('Failed to upload data. Try again.');
    } else {
      setMessage(`Successfully tracked ${selectedWaterType} with ${packetCount} packets.`);
    }
    setLoading(false);
    setSelectedWaterType(null); // Reset after submission
    setPacketCount(null); // Reset packet count after submission
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h2>Track Your Water Quality</h2>
      {message && <p>{message}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {waterTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleWaterChoice(type)}
            style={{ padding: '10px', fontSize: '16px' }}
            disabled={loading}
          >
            {type}
          </button>
        ))}
      </div>

      {selectedWaterType && (
        <div style={{ marginTop: '20px' }}>
          <label>
            <h3>How many packets are you using?</h3>
            <select
              value={packetCount ?? ''}
              onChange={(e) => setPacketCount(Number(e.target.value))}
              style={{ padding: '10px', fontSize: '16px', marginTop: '10px' }}
            >
              <option value="" disabled>Select packet count</option>
              {[1, 2, 3, 4, 5].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={handleSubmit}
            style={{ padding: '10px', fontSize: '16px', marginTop: '10px' }}
            disabled={loading || packetCount === null}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}

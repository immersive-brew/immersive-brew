// JournalEntry.tsx (Client Component)
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type JournalEntryType = {
  id: number;
  created_at: string;
  temperature?: number; // Assuming temperature is stored as a number
  coffee_weight?: number; // Assuming weight is stored as a number
  water_weight?: number; // Assuming weight is stored as a number
  grind_setting?: string;
  overall_time?: number; // Assuming time is stored as seconds (number)
};

export default function JournalEntry() {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('journal_entries')
      .select(
        'id, created_at, temperature, coffee_weight, water_weight, grind_setting, overall_time'
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
    } else {
      setEntries(data || []);
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

  if (loading) {
    return <div>Loading entries...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Coffee Journal</h1>
      <button onClick={fetchEntries} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        Refresh
      </button>
      {entries.length === 0 ? (
        <div>No entries found.</div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col border border-gray-300 rounded-lg shadow-sm overflow-hidden"
            >
              {/* Top section with date */}
              <div className="p-4 bg-gray-100">
                <div className="text-xl font-semibold">
                  Entry Date: {new Date(entry.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Bottom section with details in a grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                <div className="text-coffee-dark">
                  <strong>Temperature:</strong> {entry.temperature !== undefined ? `${entry.temperature}°C` : 'N/A'}
                </div>
                <div className="text-coffee-dark">
                  <strong>Coffee Weight:</strong> {entry.coffee_weight !== undefined ? `${entry.coffee_weight}g` : 'N/A'}
                </div>
                <div className="text-coffee-dark">
                  <strong>Water Weight:</strong> {entry.water_weight !== undefined ? `${entry.water_weight}g` : 'N/A'}
                </div>
                <div className="text-coffee-dark">
                  <strong>Grind Setting:</strong> {entry.grind_setting || 'N/A'}
                </div>
                <div className="text-coffee-dark">
                  <strong>Overall Time:</strong> {entry.overall_time !== undefined ? formatTime(entry.overall_time) : 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ManualEntryForm from '@/components/ManualEntryForm';

type RecipeType = {
  id: number;
  name: string;
  description?: string;
};

type JournalEntryType = {
  id: number;
  created_at: string;
  temperature: number;
  coffee_weight: number;
  water_weight: number;
  grind_setting: string;
  overall_time: number;
  brew_tools?: string[];
  recipes?: RecipeType;
};

type UserProfile = {
  grams: boolean;
};

export default function JournalEntry() {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<JournalEntryType | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [user, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const supabase = createClient();

  // Conversion utility functions
  const convertGramsToOunces = (grams: number): number => {
    return Number((grams * 0.03527396).toFixed(1));
  };

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      if (user) {
        setCurrentUser(user);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('grams')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else {
          setUserProfile(profileData);
        }
      }
    };

    fetchUserAndProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
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
        recipes ( id, name, description )
      `)
      .order('created_at', { ascending: false })
      .eq('userid', user.id);

    if (error) {
      console.error('Error fetching journal entries:', error);
    } else {
      // Process entries based on measurement system
      const processedEntries = data ? data.map(entry => {
        // If profile is not grams, convert weights
        if (userProfile && !userProfile.grams) {
          return {
            ...entry,
            coffee_weight: convertGramsToOunces(entry.coffee_weight),
            water_weight: convertGramsToOunces(entry.water_weight)
          };
        }
        return entry;
      }) : [];

      setEntries(processedEntries as JournalEntryType[]);
    }
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleEdit = (entry: JournalEntryType) => {
    setEditingEntry(entry);
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);

    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      fetchEntries();
    } finally {
      setDeleting(null);
    }
  };

  // Helper function to normalize brew_tools
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

  // Modify the render to show oz instead of g if not using grams
  const renderWeight = (weight: number) => {
    if (userProfile === null) return 'N/A';
    
    return userProfile.grams 
      ? `${weight}g` 
      : `${weight.toFixed(1)}oz`;
  };

  if (loading) {
    return <div className="p-4 text-center">Loading entries...</div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Coffee Journal</h1>
        <button
          onClick={fetchEntries}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {editingEntry && (
        <div className="mb-4">
          <ManualEntryForm
            entry={editingEntry}
            onUpdate={fetchEntries}
            onCancel={() => setEditingEntry(null)}
          />
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-center text-gray-600">No entries found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-white"
            >
              <div className="p-4 bg-gray-100">
                <h2 className="text-lg font-semibold">
                  {new Date(entry.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </h2>
              </div>
              <div className="p-4">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Temperature</dt>
                    <dd className="text-md font-semibold">
                      {entry.temperature !== undefined ? `${entry.temperature}°C` : 'N/A'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Coffee Weight</dt>
                    <dd className="text-md font-semibold">
                      {entry.coffee_weight !== undefined 
                        ? renderWeight(entry.coffee_weight) 
                        : 'N/A'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Water Weight</dt>
                    <dd className="text-md font-semibold">
                      {entry.water_weight !== undefined 
                        ? renderWeight(entry.water_weight) 
                        : 'N/A'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Grind Setting</dt>
                    <dd className="text-md font-semibold">{entry.grind_setting || 'N/A'}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Overall Time</dt>
                    <dd className="text-md font-semibold">
                      {entry.overall_time !== undefined ? formatTime(entry.overall_time) : 'N/A'}
                    </dd>
                  </div>

                  {/* Brewing Tools Section */}
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Brewing Tools</dt>
                    <dd className="text-md font-semibold">
                      {getBrewTools(entry.brew_tools).length > 0 ? (
                        <ul className="list-disc list-inside">
                          {getBrewTools(entry.brew_tools).map((tool, index) => (
                            <li key={index}>{tool}</li>
                          ))}
                        </ul>
                      ) : (
                        'N/A'
                      )}
                    </dd>
                  </div>

                  {/* Recipe Section */}
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Recipe</dt>
                    <dd className="text-md font-semibold">
                      {entry.recipes?.name || 'N/A'}
                    </dd>
                  </div>
                </dl>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleting === entry.id}
                  >
                    {deleting === entry.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const DisplayBrewTools = () => {
  const [brewTools, setBrewTools] = useState<{ device: string; grinder: string; espresso: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrewTools = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const supabase = createClient();
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData?.session?.user) {
          throw new Error('User not logged in');
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('brewing_tools')
          .eq('id', sessionData.session.user.id)
          .single(); // Assuming each user has a single profile

        if (error) {
          throw error;
        }

        if (data && data.brewing_tools) {
          setBrewTools(data.brewing_tools);
        } else {
          setBrewTools({ device: '', grinder: '', espresso: '' });
        }
      } catch (err: any) {
        console.error('Error fetching brewing tools:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBrewTools();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="brew-tool-display">
      <h2>Your Selected Brew Tools</h2>
      {brewTools ? (
        <div>
          <p>
            <strong>Device:</strong> {brewTools.device || 'Not selected'}
          </p>
          <p>
            <strong>Grinder:</strong> {brewTools.grinder || 'Not selected'}
          </p>
          <p>
            <strong>Espresso:</strong> {brewTools.espresso || 'Not selected'}
          </p>
        </div>
      ) : (
        <p>No brew tools selected yet.</p>
      )}
    </div>
  );
};

export default DisplayBrewTools;

'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";

const DisplayBrewTools = () => {
  const [brewTools, setBrewTools] = useState<{ device: string; grinder: string; espresso: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrewTools = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('brewtools')
          .single(); // Assumes each user has a single profile

        if (error) {
          throw error;
        }

        if (data && data.brewtools) {
          setBrewTools(data.brewtools);
        } else {
          setBrewTools({ device: '', grinder: '', espresso: '' });
        }
      } catch (error) {
        console.error('Error fetching brew tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrewTools();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="brew-tool-display">
      <h2>Your Selected Brew Tools</h2>
      {brewTools ? (
        <div>
          <p>
            <strong>Device:</strong> {brewTools.device ? brewTools.device : 'Not selected'}
          </p>
          <p>
            <strong>Grinder:</strong> {brewTools.grinder ? brewTools.grinder : 'Not selected'}
          </p>
          <p>
            <strong>Espresso:</strong> {brewTools.espresso ? brewTools.espresso : 'Not selected'}
          </p>
        </div>
      ) : (
        <p>No brew tools selected yet.</p>
      )}
    </div>
  );
};

export default DisplayBrewTools;

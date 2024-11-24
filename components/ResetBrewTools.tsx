"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const ResetBrewTools = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id); // Set the user ID from the session
      } else {
        console.error("User not logged in");
        alert("Please log in to reset brew tools.");
      }
    };

    fetchUser();
  }, []);

  const handleReset = async () => {
    if (!userId) {
      alert('User not logged in');
      return;
    }

    setIsResetting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          brewing_tools: {
            device: null,
            grinder: null,
            espresso: null,
          },
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      alert('Brew tools reset successfully!');
    } catch (error) {
      console.error('Error resetting brew tools:', error);
      alert('Failed to reset brew tools. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="reset-brew-tools">
      <h2>Reset Your Brew Tools</h2>
      <p>
        Clicking the button below will reset your brew tools configuration to its default state.
      </p>
      <button onClick={handleReset} disabled={isResetting}>
        {isResetting ? 'Resetting...' : 'Reset Brew Tools'}
      </button>
    </div>
  );
};

export default ResetBrewTools;

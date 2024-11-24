"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const EditBrewTools = () => {
  const [userId, setUserId] = useState<string | null>(null); // To store the user's ID
  const [selectedTool, setSelectedTool] = useState({
    device: '',
    grinder: '',
    espresso: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const deviceOptions = [
    'AeroPress',
    'v60',
    'chemex',
  ];

  const grinderOptions = [
    'Manual Grinder',
    'Electric Grinder',
    'No Grinder'
  ];

  const espressoOptions = [
    'Single Shot',
    'Double Shot',
    'No Espresso'
  ];

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id); // Set the user ID from the session
      } else {
        console.error("User not logged in");
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      alert('User not logged in');
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          brewing_tools: {
            device: selectedTool.device,
            grinder: selectedTool.grinder,
            espresso: selectedTool.espresso, // Corrected spelling here
          },
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      alert('Brew tools saved successfully!');
    } catch (error) {
      console.error('Error saving brew tools:', error);
      alert('Failed to save brew tools. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedTool({
      device: '',
      grinder: '',
      espresso: ''
    });
    window.location.reload(); // Refresh the page to reset all values
  };

  return (
    <div className="brew-tool-selector">
      <h2>Which brew tools do you use to make coffee?</h2>
      <div>
        <label>Device:</label>
        <select
          value={selectedTool.device}
          onChange={(e) => setSelectedTool({ ...selectedTool, device: e.target.value })}
          disabled={isSaving}
        >
          <option value="" disabled>
            Select a device
          </option>
          {deviceOptions.map((device) => (
            <option key={device} value={device}>
              {device}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Grinder:</label>
        <select
          value={selectedTool.grinder}
          onChange={(e) => setSelectedTool({ ...selectedTool, grinder: e.target.value })}
          disabled={isSaving}
        >
          <option value="" disabled>
            Select a grinder
          </option>
          {grinderOptions.map((grinder) => (
            <option key={grinder} value={grinder}>
              {grinder}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Espresso:</label>
        <select
          value={selectedTool.espresso}
          onChange={(e) => setSelectedTool({ ...selectedTool, espresso: e.target.value })}
          disabled={isSaving}
        >
          <option value="" disabled>
            Select an espresso option
          </option>
          {espressoOptions.map((espresso) => (
            <option key={espresso} value={espresso}>
              {espresso}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSave} disabled={isSaving || !selectedTool.device || !selectedTool.grinder || !selectedTool.espresso}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
      
    </div>
  );
};

export default EditBrewTools;

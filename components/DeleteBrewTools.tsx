'use client';
import React, { useState } from 'react';
import { createClient } from "@/utils/supabase/client";

const DeleteBrewTools = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to reset the brew tools to null
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .update({ brewtools: { device: null, grinder: null, espresso: null } });

      if (error) {
        throw error;
      }

      alert('Brew tools reset successfully!');
    } catch (error) {
      console.error('Error resetting brew tools:', error);
      alert('Failed to reset brew tools. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="brew-tool-deleter">
      <h2>Reset Brew Tools</h2>
      <p>Click the button below to reset all brew tool selections to null.</p>
      <button onClick={handleDelete} disabled={isDeleting} className={`w-full px-4 py-2 text-white rounded-md ${isDeleting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}>
        {isDeleting ? 'Resetting...' : 'Reset Brew Tools'}
      </button>
    </div>
  );
};

export default DeleteBrewTools;

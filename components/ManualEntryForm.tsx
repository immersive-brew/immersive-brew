'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { userAgent } from 'next/server';

type JournalEntryType = {
  id: string; // Assuming 'id' is UUID
  temperature: number;
  coffee_weight: number;
  water_weight: number;
  grind_setting: string;
  overall_time: number;
  recipeid?: string; // 'recipeid' is UUID
  userid?: string;
};

type RecipeType = {
  id: string; // UUID
  name: string;
};

interface ManualEntryFormProps {
  entry?: JournalEntryType;
  onUpdate?: () => void;
  onCancel?: () => void;
}

export default function ManualEntryForm({ entry, onUpdate, onCancel }: ManualEntryFormProps) {
  const [user, setCurrentUser] = useState<any>(null);

  // Initialize Supabase client
  const supabase = createClient();

  const [formData, setFormData] = useState({
    temperature: '',
    coffeeWeight: '',
    waterWeight: '',
    grindSetting: '',
    minutes: '',
    seconds: '',
    recipeId: '', // Keep as string
    userId: '',
  });

  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  

  // Fetch all recipes from the database
  const fetchRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes') // Ensure the table name is correct
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching recipes:', error);
      setMessage({ type: 'error', text: 'Failed to load recipes. Please try again.' });
    } else if (data && data.length > 0) {
      console.log('Fetched recipes:', data);
      setRecipes(data);
    } else {
      console.warn('No recipes found in the database');
      setMessage({ type: 'error', text: 'No recipes available. Please add a recipe first.' });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setCurrentUser(user);
        console.log('Fetched user:', user);
      }
    };
    fetchUser();
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (entry) {
      const minutes = Math.floor(entry.overall_time / 60);
      const seconds = entry.overall_time % 60;
      setFormData({
        temperature: entry.temperature.toString(),
        coffeeWeight: entry.coffee_weight.toString(),
        waterWeight: entry.water_weight.toString(),
        grindSetting: entry.grind_setting,
        minutes: minutes.toString(),
        seconds: seconds.toString(),
        recipeId: entry.recipeid || '', // No conversion needed
        userId: user.id,
      });
    }
  }, [entry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate recipe selection
    if (formData.recipeId === '') {
      setMessage({ type: 'error', text: 'Please select a recipe.' });
      setLoading(false);
      return;
    }

    // Convert minutes and seconds to total seconds
    let totalSeconds = 0;
    if (formData.minutes !== '' && formData.seconds !== '') {
      totalSeconds = parseInt(formData.minutes, 10) * 60 + parseInt(formData.seconds, 10);
    } else {
      setMessage({ type: 'error', text: 'Please select minutes and seconds for the overall time.' });
      setLoading(false);
      return;
    }

    const updatedData = {
      temperature: Number(formData.temperature),
      coffee_weight: Number(formData.coffeeWeight),
      water_weight: Number(formData.waterWeight),
      grind_setting: formData.grindSetting,
      overall_time: totalSeconds,
      recipeid: formData.recipeId, // Pass as string (UUID)
      userid: user.id,
    };

    console.log('Updated data:', updatedData);

    try {
      let response;
      if (entry) {
        response = await supabase.from('entries').update(updatedData).eq('id', entry.id);
      } else {
        response = await supabase.from('entries').insert([updatedData]);
      }

      if (response.error) {
        console.error('Error submitting the form:', response.error);
        setMessage({ type: 'error', text: response.error.message || 'Failed to submit the entry.' });
      } else {
        setMessage({
          type: 'success',
          text: entry ? 'Entry updated successfully.' : 'Entry created successfully.',
        });

        if (onUpdate) {
          onUpdate();
        }

        if (onCancel) {
          onCancel();
        }

        if (!entry) {
          setFormData({
            temperature: '',
            coffeeWeight: '',
            waterWeight: '',
            grindSetting: '',
            minutes: '',
            seconds: '',
            recipeId: '',
            userId: user.id,
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{entry ? 'Edit Entry' : 'Add New Entry'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium">Temperature (°C)</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter temperature"
            required
            min="0"
          />
        </div>

        {/* Coffee Weight */}
        <div>
          <label className="block text-sm font-medium">Coffee Weight (g)</label>
          <input
            type="number"
            name="coffeeWeight"
            value={formData.coffeeWeight}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter coffee weight"
            required
            min="0"
          />
        </div>

        {/* Water Weight */}
        <div>
          <label className="block text-sm font-medium">Water Weight (g)</label>
          <input
            type="number"
            name="waterWeight"
            value={formData.waterWeight}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter water weight"
            required
            min="0"
          />
        </div>

        {/* Grind Setting */}
        <div>
          <label className="block text-sm font-medium">Grind Setting</label>
          <input
            type="text"
            name="grindSetting"
            value={formData.grindSetting}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter grind setting"
            required
          />
        </div>

        {/* Recipe Selection */}
        <div>
          <label className="block text-sm font-medium">Select Recipe</label>
          <select
            name="recipeId" // Matches formData.recipeId
            value={formData.recipeId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">-- Select a Recipe --</option>
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name}
              </option>
            ))}
          </select>
        </div>

        {/* Overall Time */}
        <div>
          <label className="block text-sm font-medium">Overall Time</label>
          <div className="flex space-x-2 mt-1">
            {/* Minutes */}
            <div>
              <label className="block text-xs font-medium">Minutes</label>
              <select
                name="minutes"
                value={formData.minutes}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">MM</option>
                {[...Array(61)].map((_, i) => (
                  <option key={i} value={i.toString()}>
                    {String(i).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            {/* Seconds */}
            <div>
              <label className="block text-xs font-medium">Seconds</label>
              <select
                name="seconds"
                value={formData.seconds}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">SS</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={(i * 5).toString()}>
                    {String(i * 5).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit and Cancel buttons */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Feedback message */}
      {message && (
        <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

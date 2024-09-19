'use client';

import React, { useState, useEffect } from 'react';

type JournalEntryType = {
  id: number;
  temperature: number;
  coffee_weight: number;
  water_weight: number;
  grind_setting: string;
  overall_time: number;
};

interface ManualEntryFormProps {
  entry?: JournalEntryType; // Optional for editing an existing entry
  onUpdate?: () => void; // Callback to refresh entries after update
  onCancel?: () => void; // Callback to cancel editing
}

export default function ManualEntryForm({ entry, onUpdate, onCancel }: ManualEntryFormProps) {
  const [formData, setFormData] = useState({
    temperature: '',
    coffeeWeight: '',
    waterWeight: '',
    grindSetting: '',
    minutes: '',
    seconds: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Prepopulate form with existing data from the entry
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
      });
    }
  }, [entry]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

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
    };

    const url = entry ? `/api/entries/${entry.id}` : '/api/entries'; // Use the entry ID for updating if available

    try {
      const response = await fetch(url, {
        method: entry ? 'PUT' : 'POST', // Use PUT for editing, POST for new entry
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: entry ? 'Entry updated successfully' : 'Entry created successfully' });
        
        // Refresh the list after update
        if (onUpdate) {
          onUpdate();
        }

        // Close the form after successful submission
        if (onCancel) {
          onCancel();
        }
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
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
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>
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
                  <option key={i} value={i * 5}>
                    {String(i * 5).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit and Cancel buttons */}
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="ml-2 px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
          >
            Cancel
          </button>
        )}
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

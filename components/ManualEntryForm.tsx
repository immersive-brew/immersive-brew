// app/components/ManualEntryForm.tsx

'use client';

import React, { useState } from 'react';

export default function ManualEntryForm() {
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

    // Handle change for input and select elements
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Minutes options (0 to 10)
    const minuteOptions = Array.from({ length: 11 }, (_, i) => i); // [0, 1, ..., 10]

    // Seconds options (0 to 55, every 5 seconds)
    const secondOptions = Array.from({ length: 12 }, (_, i) => i * 5); // [0, 5, ..., 55]

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Convert minutes and seconds to total seconds
        let totalSeconds = 0;
        if (formData.minutes !== '' && formData.seconds !== '') {
            totalSeconds =
                parseInt(formData.minutes, 10) * 60 + parseInt(formData.seconds, 10);
        } else {
            setMessage({ type: 'error', text: 'Please select minutes and seconds for the overall time.' });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    temperature: Number(formData.temperature),
                    coffee_weight: Number(formData.coffeeWeight),
                    water_weight: Number(formData.waterWeight),
                    grind_setting: formData.grindSetting,
                    overall_time: totalSeconds,
                }),
            });

            // Log the response details
            const result = await response.json();
            console.log('API response:', result); // Add this log to see the API response

            if (response.ok) {
                setMessage({ type: 'success', text: result.message });
                // Reset form fields
                setFormData({
                    temperature: '',
                    coffeeWeight: '',
                    waterWeight: '',
                    grindSetting: '',
                    minutes: '',
                    seconds: '',
                });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            console.error('Error submitting form:', error); // Add this log to see the error details
            setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Entry</h1>
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
                        {/* Minutes Dropdown */}
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
                                {minuteOptions.map((minute) => (
                                    <option key={minute} value={minute}>
                                        {String(minute).padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Seconds Dropdown */}
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
                                {secondOptions.map((second) => (
                                    <option key={second} value={second}>
                                        {String(second).padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>

            {/* Feedback Message */}
            {message && (
                <p
                    className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}
                >
                    {message.text}
                </p>
            )}
        </div>
    );
}

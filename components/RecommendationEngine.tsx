"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const RecommendationEngine = () => {
    const [preferences, setPreferences] = useState({
        aroma: 5,
        flavor: 5,
        acidity: 5,
        body: 5,
        sweetness: 5,
    });
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);

    // Update preference values
    const handleSliderChange = (e) => {
        const { name, value } = e.target;
        setPreferences({ ...preferences, [name]: parseFloat(value) });
    };

    // Fetch recommendation from the API
    const fetchRecommendation = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/find_closest_coffee/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(preferences),
            });
            const data = await response.json();
            setRecommendation(data);
        } catch (error) {
            console.error("Error fetching recommendation:", error);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
            <motion.h1
                className="text-4xl font-bold mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Recommendation Engine
            </motion.h1>

            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                {["aroma", "flavor", "acidity", "body", "sweetness"].map((attribute) => (
                    <div key={attribute} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {attribute}
                        </label>
                        <input
                            type="range"
                            name={attribute}
                            min="0"
                            max="10"
                            step="0.1"
                            value={preferences[attribute]}
                            onChange={handleSliderChange}
                            className="w-full"
                        />
                        <div className="text-center text-sm text-gray-600 mt-1">{preferences[attribute]}</div>
                    </div>
                ))}

                <motion.button
                    onClick={fetchRecommendation}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 font-semibold"
                >
                    {loading ? "Loading..." : "Get Recommendation"}
                </motion.button>

                {recommendation && (
                    <motion.div
                        className="mt-6 bg-gray-200 p-4 rounded-lg shadow-inner"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-lg font-bold mb-2">Recommended Coffee:</h2>
                        <p><strong>ID:</strong> {recommendation.closest_coffee_id}</p>
                        <p><strong>Similarity Score:</strong> {recommendation.similarity_score.toFixed(2)}</p>
                        <p><strong>Quality:</strong> {recommendation.quality}</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RecommendationEngine;

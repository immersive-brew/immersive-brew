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
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [corsTestResult, setCorsTestResult] = useState(null);

    // Update preference values
    const handleSliderChange = (e) => {
        const { name, value } = e.target;
        setPreferences({ ...preferences, [name]: parseFloat(value) });
    };

    // Fetch recommendation from the API
    const fetchRecommendation = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/find_recommendations/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(preferences),
            });
            const data = await response.json();
            setRecommendations(data);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
        setLoading(false);
    };

    // Test CORS by calling the /cors-test endpoint
    const testCors = async () => {
        setLoading(true);
        setCorsTestResult(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cors-test`, {
                method: "GET",
            });
            if (response.ok) {
                const data = await response.json();
                setCorsTestResult(`Success: ${data.message}`);
            } else {
                setCorsTestResult("CORS Test Failed: Unable to reach the endpoint.");
            }
        } catch (error) {
            setCorsTestResult(`CORS Test Failed: ${error.message}`);
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

                {/* Display recommendations if available */}
                {recommendations && (
                    <motion.div
                        className="mt-6 bg-gray-200 p-4 rounded-lg shadow-inner"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-lg font-bold mb-2">Best Overall Recommendation</h2>
                        <p><strong>Owner:</strong> {recommendations.best_overall.owner}</p>
                        <p><strong>Variety:</strong> {recommendations.best_overall.variety}</p>
                        <p><strong>Processing:</strong> {recommendations.best_overall.processing}</p>
                        <p><strong>Similarity Score:</strong> {recommendations.best_overall.similarity_score.toFixed(2)}</p>
                        <p><strong>Quality:</strong> {recommendations.best_overall.quality}</p>

                        <h2 className="text-lg font-bold mt-6 mb-2">Best Matches for Each Attribute</h2>
                        {Object.entries(recommendations.best_matches_per_attribute).map(([attribute, match]) => (
                            <div key={attribute} className="mb-4">
                                <h3 className="text-md font-semibold capitalize">{attribute}</h3>
                                <p><strong>Owner:</strong> {match.owner}</p>
                                <p><strong>Variety:</strong> {match.variety}</p>
                                <p><strong>Processing:</strong> {match.processing}</p>
                                <p><strong>Similarity Score:</strong> {match.similarity_score.toFixed(2)}</p>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Test CORS Button */}
                <motion.button
                    onClick={testCors}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 font-semibold max-w-xs"
                >
                    {loading ? "Testing CORS..." : "Test CORS"}
                </motion.button>

                {/* Display CORS Test Result */}
                {corsTestResult && (
                    <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow">
                        <p>{corsTestResult}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationEngine;

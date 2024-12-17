"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        setRecommendations(null); // Reset previous recommendations
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/find_recommendations/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(preferences),
            });
            const data = await response.json();

            if (data.error) {
                console.error("API error:", data.error);
                setRecommendations({ error: data.error });
            } else {
                setRecommendations(data);
            }
        } catch (error) {
            console.error("Network or other error:", error);
            setRecommendations({ error: "An unexpected error occurred. Please try again." });
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

    // Function to generate Google search URL
    const generateGoogleSearchUrl = (owner, variety, processingMethod) => {
        const query = `${owner} ${variety} ${processingMethod}`;
        const encodedQuery = encodeURIComponent(query);
        return `https://www.google.com/search?q=${encodedQuery}`;
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.05, backgroundColor: "#2563EB", transition: { duration: 0.3 } },
        tap: { scale: 0.95 },
    };

    const linkVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2 } },
    };

    // Spinner Component
    const Spinner = () => (
        <svg
            className="animate-spin h-5 w-5 text-white inline-block ml-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
            ></path>
        </svg>
    );

    return (
        <motion.div
            className="flex flex-col items-center justify-center bg-transparent p-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1
                className="text-3xl font-bold mb-8"
                variants={cardVariants}
            >
                Recommendation Engine
            </motion.h1>

            <motion.div
                className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg"
                variants={cardVariants}
            >
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
                        <div className="text-center text-sm text-gray-600 mt-1">
                            {preferences[attribute]}
                        </div>
                    </div>
                ))}

                <motion.button
                    onClick={fetchRecommendation}
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 font-semibold shadow-md focus:outline-none flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            Loading...
                            <Spinner />
                        </>
                    ) : (
                        "Get Recommendation"
                    )}
                </motion.button>

                {/* Display recommendations or error message */}
                <AnimatePresence>
                    {recommendations && (
                        recommendations.error ? (
                            <motion.div
                                className="mt-4 p-4 bg-red-200 rounded-lg shadow"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>{recommendations.error}</p>
                            </motion.div>
                        ) : (
                            <>
                                <motion.div
                                    className="mt-6 bg-gray-200 p-4 rounded-lg shadow-inner"
                                    variants={cardVariants}
                                >
                                    <h2 className="text-lg font-bold mb-2">Best Overall Recommendation</h2>
                                    <p><strong>Owner:</strong> {recommendations.best_overall.owner}</p>
                                    <p><strong>Variety:</strong> {recommendations.best_overall.variety}</p>
                                    <p><strong>Processing Method:</strong> {recommendations.best_overall.processing_method}</p>
                                    <p><strong>Quality:</strong> {recommendations.best_overall.quality}</p>
                                    {/* Google Search Link */}
                                    <motion.a
                                        href={generateGoogleSearchUrl(
                                            recommendations.best_overall.owner,
                                            recommendations.best_overall.variety,
                                            recommendations.best_overall.processing_method
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline mt-2 inline-block"
                                        variants={linkVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        Search on Google
                                    </motion.a>
                                </motion.div>

                                <h2 className="text-lg font-bold mt-6 mb-2">Best Matches for Each Attribute</h2>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {['best_aroma', 'best_flavor', 'best_acidity', 'best_body', 'best_sweetness'].map((key) => {
                                        const match = recommendations[key];
                                        const attribute = key.replace('best_', '');
                                        return (
                                            <motion.div
                                                key={attribute}
                                                className="mt-4 bg-gray-100 p-4 rounded-lg shadow"
                                                variants={cardVariants}
                                                whileHover={{ scale: 1.02, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }}
                                            >
                                                <h3 className="text-md font-semibold capitalize">{attribute}</h3>
                                                <p><strong>Owner:</strong> {match.owner}</p>
                                                <p><strong>Variety:</strong> {match.variety}</p>
                                                <p><strong>Processing Method:</strong> {match.processing_method}</p>
                                                <p><strong>{attribute.charAt(0).toUpperCase() + attribute.slice(1)} Score:</strong> {match[attribute]}</p>
                                                {/* Google Search Link */}
                                                <motion.a
                                                    href={generateGoogleSearchUrl(
                                                        match.owner,
                                                        match.variety,
                                                        match.processing_method
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline mt-2 inline-block"
                                                    variants={linkVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                >
                                                    Search on Google
                                                </motion.a>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </>
                        )
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default RecommendationEngine;

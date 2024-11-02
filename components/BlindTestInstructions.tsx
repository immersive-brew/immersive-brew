"use client";
import React, { useState } from "react";

interface BlindTestInstructionsProps {
    beanCount: number; // Number of selected beans
}

const steps = [
    "Grind the beans finely. Press 'Next' when done.",
    "Boil hot water to 100°C.",
    "Prepare the same number of cups as the beans you selected.",
    "Pour the ground beans into each cup and mix gently.",
];

export default function BlindTestInstructions({ beanCount }: BlindTestInstructionsProps) {
    const [currentStep, setCurrentStep] = useState(0);

    // Handle the "Next" button click
    const handleNextClick = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    // Final message after all steps
    const finalMessage = `Enjoy your coffee tasting session with ${beanCount} cup${beanCount > 1 ? "s" : ""}!`;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold text-center mb-6">Instructions</h2>

            <p className="text-center mb-4">
                {currentStep < steps.length ? steps[currentStep] : finalMessage}
            </p>

            {/* Display number of cups instruction dynamically based on bean count */}
            {currentStep === 2 && (
                <p className="text-center font-semibold mb-4">
                    Prepare {beanCount} cup{beanCount > 1 ? "s" : ""}.
                </p>
            )}

            {currentStep < steps.length ? (
                <button
                    onClick={handleNextClick}
                    className="w-full mt-4 py-2 text-white font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 transition"
                >
                    Next
                </button>
            ) : (
                <button
                    onClick={() => alert("Session complete!")}
                    className="w-full mt-4 py-2 text-white font-semibold rounded-lg bg-green-500 hover:bg-green-600 transition"
                >
                    Finish
                </button>
            )}
        </div>
    );
}

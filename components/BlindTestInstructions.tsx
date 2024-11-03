"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlindTestInstructionsProps {
  beanCount: number; // Number of selected beans
}

// Steps now include an emoji for each instruction
const getSteps = (beanCount: number) => [
  {
    text: "Grind the beans finely. Press 'Next' when done.",
    emoji: "☕️",
  },
  {
    text: "Boil hot water to 100°C.",
    emoji: "🔥",
  },
  {
    text: `Prepare ${beanCount} cup${beanCount > 1 ? "s" : ""} and pour water into each.`,
    emoji: "🥤",
  },
  {
    text: "Pour the ground beans into each cup and mix gently.",
    emoji: "🌀",
  },
];

export default function BlindTestInstructions({ beanCount }: BlindTestInstructionsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = getSteps(beanCount);

  // Handle the "Next" button click
  const handleNextClick = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Final message after all steps
  const finalMessage = `Enjoy your coffee tasting session with ${beanCount} cup${
    beanCount > 1 ? "s" : ""
  }!`;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Instructions</h2>

      <AnimatePresence mode="wait">
        {currentStep < steps.length ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">{steps[currentStep].emoji}</div>
              <p>{steps[currentStep].text}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="final"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">🎉</div>
              <p>{finalMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

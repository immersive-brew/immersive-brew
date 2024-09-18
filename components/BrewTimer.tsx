"use client"; // Ensure this component is client-side

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Color interpolation function
const interpolateColor = (startColor, endColor, factor) => {
  const result = startColor.slice(1).match(/.{2}/g).map((c, i) => {
    const startValue = parseInt(c, 16);
    const endValue = parseInt(endColor.slice(1).match(/.{2}/g)[i], 16);
    return Math.round(startValue + (endValue - startValue) * factor).toString(16).padStart(2, "0");
  });
  return `#${result.join('')}`;
};

const stages = [
  { name: "First Pour/Bloom", duration: 30 }, // duration in seconds
  { name: "Second Pour", duration: 30 },
  { name: "Third Pour", duration: 30 },
  { name: "Fourth Pour", duration: 30 },
  { name: "Fifth Pour/Drawdown", duration: 90 },
];

const r = 80; // radius of the circle
const circumference = 2 * Math.PI * r; // calculate circumference

export default function BrewTimer() {
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stages[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [overallTime, setOverallTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isActive) {
      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (timeLeft === 0 && currentStage < stages.length - 1) {
        // Move to the next stage
        setCurrentStage((prevStage) => {
          const nextStage = prevStage + 1;
          setTimeLeft(stages[nextStage].duration);
          return nextStage;
        });
      } else if (timeLeft === 0 && currentStage === stages.length - 1) {
        // Timer completed
        setIsActive(false);
      }
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentStage]);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        if (startTime) {
          setOverallTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const startTimer = () => {
    setIsActive(true);
    setStartTime(Date.now());
  };

  const resetTimer = () => {
    setIsActive(false);
    setCurrentStage(0);
    setTimeLeft(stages[0].duration);
    setOverallTime(0);
    setStartTime(null);
  };

  // Helper function to format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Calculate the current strokeDashoffset based on time left
  const strokeDashoffset = (timeLeft / stages[currentStage].duration) * circumference;

  // Calculate fill height based on time left (from 0 to full height as time decreases)
  const fillPercentage = (1 - timeLeft / stages[currentStage].duration) * 100;

  // Determine the fill color: start with blue and gradually turn brown as stages progress
  const startColor = "#00bfff"; // Blue for the first stage
  const endColor = "#6F4E37";   // Coffee brown for subsequent stages
  const colorFactor = Math.min(currentStage / (stages.length - 1), 1); // Factor between 0 and 1
  const fillColor = interpolateColor(startColor, endColor, colorFactor);

  // Display the next stage and its duration if it exists
  const nextStage = currentStage < stages.length - 1 ? stages[currentStage + 1] : null;

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-md mx-auto bg-white">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Brew Timer</h2>
      
      <div className="mt-6 space-y-6">
        {/* Current Stage */}
        <div className="text-center">
          <p className="text-lg text-gray-700">
            <strong>Current Stage:</strong> {stages[currentStage].name}
          </p>
        </div>

        {/* Next Stage (if applicable) */}
        {nextStage && (
          <div className="text-center">
            <p className="text-lg text-gray-600">
              <strong>Next Stage:</strong> {nextStage.name} ({nextStage.duration}s)
            </p>
          </div>
        )}
        
        {/* Overall Time */}
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800">
            <strong>Overall Time:</strong> {formatTime(overallTime)}
          </p>
        </div>
        
        {/* SVG Timer */}
        <div className="flex justify-center">
          <motion.svg width="200" height="200" viewBox="0 0 200 200">
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r={r}
              stroke="lightgray"
              strokeWidth="5"
              fill="none"
            />

            {/* Filled Circle (animated water rising effect only for the first stage) */}
            <motion.circle
              cx="100"
              cy="100"
              r={r}
              stroke={fillColor}
              strokeWidth="5"
              fill={fillColor}
              clipPath="inset(100% 0 0 0)" // start clipped
              animate={
                currentStage === 0
                  ? { clipPath: `inset(${100 - fillPercentage}% 0 0 0)` }
                  : { clipPath: `inset(0% 0 0 0)` } // fully filled after the first stage
              }
              transition={{ duration: 1, ease: "linear" }}
            />

            {/* Outline circle for animation */}
            <motion.circle
              cx="100"
              cy="100"
              r={80}
              stroke="#ff0055"
              strokeWidth="5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
            />

            {/* Text inside the circle */}
            <text
              x="100"
              y="105"
              textAnchor="middle"
              fontSize="32"
              fill="#333"
              dominantBaseline="middle"
            >
              {formatTime(timeLeft)}
            </text>
          </motion.svg>
        </div>
        
        {/* Control Buttons */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={startTimer}
            className={`w-full font-bold py-2 px-4 rounded ${
              isActive
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={isActive} // Disable the button when the timer is active
          >
            Start
          </button>
          <button
            onClick={resetTimer}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

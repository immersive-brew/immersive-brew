"use client"; // Ensure this component is client-side

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const stages = [
  { name: "Bloom", duration: 30 }, // duration in seconds
  { name: "First Pour", duration: 45 },
  { name: "Second Pour", duration: 60 },
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
    if (isActive) {
      const interval = setInterval(() => {
        if (startTime) {
          setOverallTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
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

  // Calculate the current strokeDashoffset based on time left
  const strokeDashoffset = (timeLeft / stages[currentStage].duration) * circumference;

  // Calculate fill height based on time left (from 0 to full height as time decreases)
  const fillPercentage = (1 - timeLeft / stages[currentStage].duration) * 100;

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold">Brew Timer</h2>
      <div className="mt-4">
        <p className="text-lg">
          <strong>Current Stage:</strong> {stages[currentStage].name}
        </p>
        <p className="text-lg">
          <strong>Overall Time:</strong> {overallTime}s
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={startTimer}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Start
          </button>
          <button
            onClick={resetTimer}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Reset
          </button>

          {/* SVG for the filling effect */}
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

            {/* Filled Circle (animated water rising effect) */}
            <motion.circle
              cx="100"
              cy="100"
              r={r}
              stroke="#00bfff"
              strokeWidth="5"
              fill="#00bfff"
              clipPath="inset(100% 0 0 0)" // start clipped
              animate={{ clipPath: `inset(${100 - fillPercentage}% 0 0 0)` }} // Animate fill
              transition={{ duration: 1, ease: "linear" }}
            />

            {/* Outline circle for animation */}
            <motion.circle
              cx="100"
              cy="100"
              r="80"
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
              fontSize="24"
              fill="#333"
              dominantBaseline="middle"
            >
              {timeLeft}s
            </text>
          </motion.svg>
        </div>
      </div>
    </div>
  );
}

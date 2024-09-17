"use client"; // Ensure this component is client-side

import { useState, useEffect } from "react";

const stages = [
  { name: "Bloom", duration: 30 }, // duration in seconds
  { name: "First Pour", duration: 45 },
  { name: "Second Pour", duration: 60 },
];

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
        setCurrentStage((prev) => prev + 1);
        setTimeLeft(stages[currentStage + 1].duration);
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

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold">Brew Timer</h2>
      <div className="mt-4">
        <p className="text-lg">
          <strong>Current Stage:</strong> {stages[currentStage].name}
        </p>
        <p className="text-lg">
          <strong>Time Left:</strong> {timeLeft}s
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
        </div>
      </div>
    </div>
  );
}

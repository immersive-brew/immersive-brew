"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation, useMotionValue, animate } from "framer-motion";
import { createClient } from "@/utils/supabase/client"; // Importing Supabase client
import { useRouter } from "next/navigation";

interface RecipeStep {
  weight: number | null;
  duration: number; // Duration in seconds
  step_type: string;
  description: string;
}

interface BrewTimerProps {
  stages: RecipeStep[]; // Receive stages as props
  recipeId: number;     // Add recipeId to identify the recipe
  temperature: number;  // Add temperature prop
  grindSetting: number; // Add grindSetting prop
  waterAmount: number;  // Add waterAmount prop
  coffeeAmount: number; // Add coffeeAmount prop
}

const supabase = createClient();

const BrewTimer: React.FC<BrewTimerProps> = ({ stages, recipeId, temperature, grindSetting, waterAmount, coffeeAmount }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stages[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [overallTime, setOverallTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const router = useRouter();

  const r = 80; // Radius of the circle
  const circumference = 2 * Math.PI * r;

  const circleCenterX = 100;
  const circleCenterY = 100;
  const circleTopY = circleCenterY - r; // 20
  const circleBottomY = circleCenterY + r; // 180
  const circleHeight = circleBottomY - circleTopY; // 160

  // Controls for animations
  const fillControls = useAnimation();
  const outlineControls = useAnimation();
  const fillColor = useMotionValue("#00bfff"); // Start with blue color

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive) {
      timer = setInterval(() => {
        setOverallTime((prev) => prev + 1);

        if (timeLeft > 0) {
          setTimeLeft((prev) => prev - 1);
        } else if (currentStage < stages.length - 1) {
          // Move to the next stage
          setCurrentStage((prevStage) => prevStage + 1);
          setTimeLeft(stages[currentStage + 1].duration);
        } else {
          // Continue counting overallTime even after last stage
          setTimeLeft(0);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentStage, stages]);

  useEffect(() => {
    if (isActive) {
      // Animate the fill during the first stage
      if (currentStage === 0) {
        fillControls.start({
          y: circleTopY,
          transition: {
            duration: stages[0].duration,
            ease: "linear",
          },
        });

        // Animate fill color interpolation over time
        animateColorInterpolation(stages[0].duration);
      }
      // Animate the outline for each stage
      outlineControls.start({
        strokeDashoffset:
          circumference * (1 - timeLeft / stages[currentStage].duration),
        transition: {
          duration: 1,
          ease: "linear",
        },
      });
    } else {
      // Reset animations when not active
      fillControls.set({ y: circleBottomY });
      outlineControls.set({ strokeDashoffset: 0 });
      fillColor.set("#00bfff"); // Reset fill color to start color
    }
  }, [
    isActive,
    timeLeft,
    currentStage,
    stages,
    fillControls,
    outlineControls,
    circumference,
    fillColor,
    circleTopY,
    circleBottomY,
  ]);

  const animateColorInterpolation = (duration: number) => {
    const startColor = "#00bfff"; // Blue
    const endColor = "#6F4E37"; // Coffee brown

    animate(0, 1, {
      duration: duration,
      ease: "linear",
      onUpdate: (latest) => {
        fillColor.set(interpolateColor(startColor, endColor, latest));
      },
    });
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setCurrentStage(0);
    setTimeLeft(stages[0].duration);
    setOverallTime(0);
    fillControls.set({ y: circleBottomY });
    outlineControls.set({ strokeDashoffset: 0 });
    fillColor.set("#00bfff"); // Reset fill color to start color
  };

  const finishBrew = async () => {
    setIsActive(false);
    setIsFinished(true);

    // Prepare data to insert into Supabase
    const entryData = {
      recipeid: recipeId,
      overall_time: overallTime,
      temperature: temperature,
      grind_setting: grindSetting,
      water_weight: waterAmount,
      coffee_weight: coffeeAmount,
    };

    try {
      const { data, error } = await supabase.from("entries").insert([entryData]);

      if (error) {
        console.error("Error inserting data:", error);
        alert("An error occurred while saving your brew data.");
      } else {
        alert("Brew data saved successfully!");
        // Optionally redirect or perform other actions
        router.push("/protected/journal"); // Replace with your desired route
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };

  // Helper function to format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Display the next stage and its duration if it exists
  const nextStage =
    currentStage < stages.length - 1 ? stages[currentStage + 1] : null;

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-md mx-auto bg-white">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Brew Timer
      </h2>

      <div className="mt-6 space-y-6">
        {/* Current Stage */}
        <div className="text-center">
          <p className="text-lg text-gray-700">
            <strong>Current Stage:</strong>{" "}
            {stages[currentStage].description}
          </p>
        </div>

        {/* Next Stage (if applicable) */}
        {nextStage && (
          <div className="text-center">
            <p className="text-lg text-gray-600">
              <strong>Next Stage:</strong> {nextStage.description} (
              {formatTime(nextStage.duration)})
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
          <svg width="200" height="200" viewBox="0 0 200 200">
            <defs>
              {/* Clip Path for Water Filling Effect */}
              <clipPath id="clip-circle">
                <circle cx={circleCenterX} cy={circleCenterY} r={r} />
              </clipPath>
            </defs>

            {/* Background Circle */}
            <circle
              cx={circleCenterX}
              cy={circleCenterY}
              r={r}
              stroke="lightgray"
              strokeWidth="5"
              fill="none"
            />

            {/* Water Fill Animation (First Stage Only) */}
            {currentStage === 0 && (
              <motion.rect
                x={circleCenterX - r}
                y={circleBottomY}
                width={r * 2}
                height={circleHeight}
                clipPath="url(#clip-circle)"
                animate={fillControls}
                initial={{ y: circleBottomY }}
                style={{ fill: fillColor }}
              />
            )}

            {/* Outline Circle */}
            <motion.circle
              cx={circleCenterX}
              cy={circleCenterY}
              r={r}
              stroke="#000000" // Black outline
              strokeWidth="5"
              fill="none"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={outlineControls}
            />

            {/* Text Inside the Circle */}
            <text
              x={circleCenterX}
              y={circleCenterY + 5}
              textAnchor="middle"
              fontSize="32"
              fill="#333"
              dominantBaseline="middle"
            >
              {formatTime(timeLeft)}
            </text>
          </svg>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col items-center gap-4">
          {!isActive && !isFinished && (
            <button
              onClick={startTimer}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Start
            </button>
          )}

          {isActive && (
            <button
              onClick={finishBrew}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded animate-pulse"
            >
              Finish
            </button>
          )}

          {(isFinished || isActive) && (
            <button
              onClick={resetTimer}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to interpolate colors
const interpolateColor = (
  startColor: string,
  endColor: string,
  factor: number
): string => {
  const hex = (x: number) => {
    const hexVal = Math.round(x).toString(16);
    return hexVal.length === 1 ? "0" + hexVal : hexVal;
  };

  const start = {
    r: parseInt(startColor.slice(1, 3), 16),
    g: parseInt(startColor.slice(3, 5), 16),
    b: parseInt(startColor.slice(5, 7), 16),
  };
  const end = {
    r: parseInt(endColor.slice(1, 3), 16),
    g: parseInt(endColor.slice(3, 5), 16),
    b: parseInt(endColor.slice(5, 7), 16),
  };

  const r = start.r + factor * (end.r - start.r);
  const g = start.g + factor * (end.g - start.g);
  const b = start.b + factor * (end.b - start.b);

  return `#${hex(r)}${hex(g)}${hex(b)}`;
};

export default BrewTimer;

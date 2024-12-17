'use client';

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface RecipeStep {
  weight: number | null;
  duration: number; // Duration in seconds
  step_type: string;
  description: string;
}

interface BrewTimerProps {
  stages: RecipeStep[];
  recipeId: number;
  temperature: number;
  grindSetting: number;
  waterAmount: number;
  coffeeAmount: number;
  brewTools?: string[];
}

const supabase = createClient();

const BrewTimer: React.FC<BrewTimerProps> = ({
  stages,
  recipeId,
  temperature,
  grindSetting,
  waterAmount,
  coffeeAmount,
  brewTools = [],
}) => {
  const router = useRouter();

  // User state
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Timer states
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(stages[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [overallTime, setOverallTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Animations
  const outlineControls = useAnimation();
  const waterLevelControls = useAnimation();
  const dropsControls = useAnimation();

  const r = 80;
  const circumference = 2 * Math.PI * r;
  const circleCenterX = 100;
  const circleCenterY = 100;

  // Fetch user before anything
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(user);
      }
      setUserLoading(false);
    };
    fetchUser();
  }, []);

  // Brewing Animation
  useEffect(() => {
    if (isActive) {
      const stageDuration = stages[currentStage].duration;
      const maxHeight = 70; // Maximum height of water (in percentage)

      // Water level rising animation with controlled max height
      waterLevelControls.start({
        height: `${Math.min(maxHeight, 100)}%`,
        transition: {
          duration: stageDuration,
          ease: "easeInOut",
        },
      });

      // Dripping/brewing animation for later stages
      if (currentStage > 0) {
        dropsControls.start({
          y: [0, 50, 0],
          opacity: [0.3, 1, 0.3],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        });
      }
    } else {
      waterLevelControls.set({ height: 0 });
      dropsControls.set({ y: 0, opacity: 0 });
    }
  }, [isActive, currentStage, waterLevelControls, dropsControls, stages]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setOverallTime((prev) => prev + 1);
        if (timeLeft > 0) {
          setTimeLeft((prev) => prev - 1);
        } else {
          // Move to next stage or end
          if (currentStage < stages.length - 1) {
            const next = currentStage + 1;
            setCurrentStage(next);
            setTimeLeft(stages[next].duration);
            
            // Reset water level for new stage
            waterLevelControls.set({ height: 0 });
          } else {
            // After last stage, just set timeLeft to 0 (brew done)
            setTimeLeft(0);
            finishBrew(); // Automatically finish brew when last stage is done
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentStage, stages]);

  // Timer Animation
  useEffect(() => {
    if (isActive) {
      const fraction = timeLeft / stages[currentStage].duration;
      outlineControls.start({
        strokeDashoffset: circumference * fraction,
        transition: {
          duration: 1,
          ease: "linear",
        },
      });
    } else {
      outlineControls.set({ strokeDashoffset: circumference });
    }
  }, [isActive, timeLeft, currentStage, stages, outlineControls, circumference]);

  const startTimer = () => {
    if (!user) return; // Ensure user is loaded before starting
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setCurrentStage(0);
    setTimeLeft(stages[0].duration);
    setOverallTime(0);
    waterLevelControls.set({ height: 0 });
    outlineControls.set({ strokeDashoffset: circumference });
  };

  const finishBrew = async () => {
    setIsActive(false);
    setIsFinished(true);

    if (!user) {
      alert("User not found. Please log in.");
      return;
    }

    try {
      // Fetch the current maximum id from the entries table
      const { data: maxEntry, error: maxEntryError } = await supabase
        .from('entries')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (maxEntryError && maxEntryError.code !== 'PGRST116') { // PGRST116: No rows found
        console.error('Error fetching max entry id:', maxEntryError);
        alert("An error occurred while determining the entry ID.");
        return;
      }

      let newId = 1;
      if (maxEntry && maxEntry.id) {
        newId = maxEntry.id + 1;
      }

      const entryData = {
        id: newId, // Manually set the id
        recipeid: recipeId,
        overall_time: overallTime,
        temperature,
        grind_setting: grindSetting,
        water_weight: waterAmount,
        coffee_weight: coffeeAmount,
        userid: user.id,
        brew_tools: brewTools, // Save the selected brewing tools
      };

      const { error } = await supabase.from("entries").insert([entryData]);

      if (error) {
        console.error("Error inserting data:", error);
        alert("An error occurred while saving your brew data.");
      } else {
        alert("Brew data saved successfully!");
        router.push("/protected/coffeewheel");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const nextStage =
    currentStage < stages.length - 1 ? stages[currentStage + 1] : null;

  // If user loading, show loading state
  if (userLoading) {
    return <div className="p-6">Loading user data...</div>;
  }

  // If no user, show error or ask to log in
  if (!user) {
    return <div className="p-6">No user found. Please log in.</div>;
  }

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-md mx-auto bg-white flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Brew Timer
      </h2>

      <div className="mt-6 space-y-6 flex flex-col items-center">
        {/* Current Stage Display */}
        <div className="text-center">
          <p className="text-lg text-gray-700">
            <strong>Current Stage:</strong> {stages[currentStage].description}
          </p>
        </div>

        {/* Next Stage */}
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

        {/* Display brewing setup */}
        <div className="flex flex-row items-center justify-center gap-8 w-full">
          {/* Brewing Setup Visualization */}
          <div className="relative w-40 h-60 border-2 border-gray-300 rounded overflow-hidden">
            {/* Coffee Grounds */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-[#6F4E37] opacity-80"
              style={{ height: '30%' }}
            />

            {/* Water Level with Controlled Max Height */}
            <motion.div
              className="absolute bottom-[30%] left-0 w-full bg-blue-300 opacity-70"
              initial={{ height: 0 }}
              animate={waterLevelControls}
            />

            {/* Brewing Drops */}
            {currentStage > 0 && (
              <motion.div 
                className="absolute top-[10%] left-[50%] w-2 h-2 bg-blue-500 rounded-full"
                initial={{ y: 0, opacity: 0 }}
                animate={dropsControls}
              />
            )}
          </div>

          {/* Circular Timer */}
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle
                cx={circleCenterX}
                cy={circleCenterY}
                r={r}
                stroke="lightgray"
                strokeWidth="5"
                fill="none"
              />

              <motion.circle
                cx={circleCenterX}
                cy={circleCenterY}
                r={r}
                stroke="#000"
                strokeWidth="5"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={outlineControls}
              />

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
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 w-full">
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

export default BrewTimer;
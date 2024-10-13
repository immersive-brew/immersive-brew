"use client"; // Indicates that this is a client-side component in Next.js

import { useState, useEffect } from 'react'; // Import React hooks for state management and side effects
import { motion } from 'framer-motion'; // Import motion component from framer-motion for animations
import BeansModal from './BeansModal'; // Import custom BeansModal component
import { createClient } from '@/utils/supabase/client'; // Import function to create Supabase client

// Define the main component, accepting a userid prop
const ExpressoJournalClient = ({ userid }) => {
  // State declarations using useState hook
  const [preInfusionTime, setPreInfusionTime] = useState(0); // State for pre-infusion time
  const [notes, setNotes] = useState(''); // State for user notes
  const [coffeeBeans, setCoffeeBeans] = useState(0); // State for coffee beans weight
  const [initialDose, setInitialDose] = useState(0); // State for initial coffee dose
  const [yieldAmount, setYieldAmount] = useState(0); // State for espresso yield amount
  const [grinderSetting, setGrinderSetting] = useState(5); // State for grinder setting, default 5
  const [shots, setShots] = useState(1); // State for number of shots, default 1
  const [bagWeight, setBagWeight] = useState(0); // State for bag weight
  const [showBeansModal, setShowBeansModal] = useState(false); // State to control BeansModal visibility
  const [isTimerRunning, setIsTimerRunning] = useState(false); // State to track if timer is running
  const [elapsedTime, setElapsedTime] = useState(0); // State for elapsed time in seconds
  const [shotFinishedTime, setShotFinishedTime] = useState(0); // State for shot finished time in minutes

  const supabase = createClient(); // Initialize Supabase client

  // useEffect hook for timer functionality
  useEffect(() => {
    let timer; // Variable to store the timer

    // Start the timer when isTimerRunning is true
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev < shotFinishedTime * 60) { // Check if elapsed time is less than shot finished time (in seconds)
            return prev + 1; // Increment elapsed time
          } else {
            setIsTimerRunning(false); // Stop the timer when it reaches the shot finished time
            return prev; // Return current elapsed time without incrementing
          }
        });
      }, 1000); // Update every second
    }

    // Cleanup function to clear the interval when component unmounts or dependencies change
    return () => clearInterval(timer);
  }, [isTimerRunning, shotFinishedTime]); // Dependencies for the effect

  // Function to calculate shot finished time based on yield amount and bag weight
  const calculateShotFinishedTime = () => {
    if (yieldAmount > 0 && bagWeight > 0) {
      const brewTime = (yieldAmount / bagWeight) * 30; // Calculate brew time based on yield and bag weight
      setShotFinishedTime(brewTime); // Update shot finished time state
    } else {
      setShotFinishedTime(0); // Reset to 0 if values are invalid
    }
  };

  // useEffect hook to update shot finished time when yield or bag weight changes
  useEffect(() => {
    calculateShotFinishedTime();
  }, [yieldAmount, bagWeight]);

  // Function to handle saving journal entry to Supabase
  const handleSave = async () => {
    const { data, error } = await supabase
      .from('espresso') // Specify the table name
      .insert({ // Insert new record with the following data
        userid,
        preInfusionTime,
        shotFinishedTime,
        coffeeBeans,
        initialDose,
        yieldAmount,
        grinderSetting,
        shots,
        notes,
        bagWeight,
      });

    if (error) {
      console.error('Error saving journal entry', error); // Log error if insertion fails
    } else {
      console.log('Journal entry saved successfully', data); // Log success message with returned data
    }
  };

  // Function to handle adding beans data from BeansModal
  const handleAddBeans = (beansData) => {
    setCoffeeBeans(beansData.coffeeName); // Set coffee name as beans display
    setBagWeight(beansData.bagWeight); // Set bag weight from modal data
    setShowBeansModal(false); // Close the modal
  };

  // Function to start the timer
  const handleStartTimer = () => {
    setElapsedTime(0); // Reset elapsed time to 0
    setIsTimerRunning(true); // Start the timer
  };

  // Calculate fill percentage for the timer animation
  const fillPercentage = elapsedTime / (shotFinishedTime * 60);

  // Component's JSX structure
  return (
    <div className="p-6 max-w-3xl mx-auto bg-black text-white rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-bold mb-4">Espresso Journal</h1>

      {/* Circular timer display */}
      <div className="flex justify-center items-center mb-8">
        <motion.div
          className="relative w-56 h-56 flex items-center justify-center bg-gray-800 rounded-full border-4 border-[#D4A373]"
          style={{
            clipPath: 'circle(50%)',
          }}
        >
          {/* Fill animation for timer */}
          <motion.div
            className="absolute inset-0 bg-blue-500 bg-opacity-50"
            style={{
              clipPath: `inset(${100 - (fillPercentage * 100)}% 0% 0% 0%)`,
            }}
            transition={{ duration: 1 }}
          />

          <div className="text-center">
            <p className="text-3xl">{coffeeBeans > 0 ? `${coffeeBeans}g` : 'Add Beans'}</p>
            <p className="text-xl">{elapsedTime.toFixed(2)} sec</p>
            <p className="text-xl font-bold">{shotFinishedTime} mins</p>
            <button onClick={handleStartTimer} className="mt-2 bg-[#D4A373] text-black p-2 rounded-lg hover:bg-[#c78d5d]">
              Start
            </button>
          </div>
        </motion.div>
      </div>

      {/* Grid layout for input fields */}
      <div className="grid grid-cols-2 gap-6">
        {/* Coffee weight input */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-xl font-bold">Coffee (g):</label>
          <input
            type="number"
            value={coffeeBeans}
            onChange={(e) => setCoffeeBeans(Number(e.target.value))}
            className="w-full p-2 bg-black border border-gray-600 rounded"
          />
        </div>

        {/* Yield amount input */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-xl font-bold">Yield (g):</label>
          <input
            type="number"
            value={yieldAmount}
            onChange={(e) => setYieldAmount(Number(e.target.value))}
            className="w-full p-2 bg-black border border-gray-600 rounded"
          />
        </div>

        {/* Grinder setting input */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-xl font-bold">Grinder:</label>
          <input
            type="number"
            value={grinderSetting}
            onChange={(e) => setGrinderSetting(Number(e.target.value))}
            className="w-full p-2 bg-black border border-gray-600 rounded"
          />
        </div>

        {/* Pre-infusion time input */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-xl font-bold">Pre-Infusion Time:</label>
          <input
            type="number"
            value={preInfusionTime}
            onChange={(e) => setPreInfusionTime(Number(e.target.value))}
            className="w-full p-2 bg-black border border-gray-600 rounded"
          />
        </div>

        {/* Number of shots input */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-xl font-bold">Shots:</label>
          <input
            type="number"
            value={shots}
            onChange={(e) => setShots(Number(e.target.value))}
            className="w-full p-2 bg-black border border-gray-600 rounded"
          />
        </div>

        {/* Initial dose input */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-xl font-bold">Initial Dose (g):</label>
          <input
            type="number"
            value={initialDose}
            onChange={(e) => setInitialDose(Number(e.target.value))}
            className="w-full p-2 bg-black border border-gray-600 rounded"
          />
        </div>

        {/* Bag weight input */}
        <div className="bg-gray-800 p-4 rounded-lg col-span-2">
          <label className="block text-xl font-bold">Bag Weight (g):</label>
          <input
            type="number"
            value={bagWeight}
            onChange={(e) => setBagWeight(Number(e.target.value))}
            className="w-full p-2 bg-black border border-gray-600 rounded"
          />
        </div>

        {/* Notes textarea */}
        <div className="bg-gray-800 p-4 rounded-lg col-span-2">
          <label className="block text-xl font-bold">Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 bg-black border border-gray-600 rounded"
          />
        </div>

        {/* Button to open BeansModal */}
        <div className="col-span-2">
          <button
            onClick={() => setShowBeansModal(true)}
            className="w-full bg-[#D4A373] text-black p-4 rounded-lg hover:bg-[#c78d5d]"
          >
            Add Beans
          </button>
        </div>

        {/* Save button */}
        <div className="col-span-2">
          <button
            onClick={handleSave}
            className="w-full bg-[#D4A373] text-black p-4 rounded-lg hover:bg-[#c78d5d]"
          >
            Save Journal Entry
          </button>
        </div>
      </div>

      {/* Conditional rendering of BeansModal */}
      {showBeansModal && <BeansModal onClose={handleAddBeans} />}
    </div>
  );
};

export default ExpressoJournalClient; // Export the component for use in other parts of the application

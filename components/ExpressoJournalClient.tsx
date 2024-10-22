"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BeansModal from './BeansModal';
import { createClient } from '@/utils/supabase/client';

interface EspressoJournalClientProps {
  userId: string;
}

const EspressoJournalClient: React.FC<EspressoJournalClientProps> = ({ userId }) => {
  const [preInfusionTime, setPreInfusionTime] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [coffeeBeans, setCoffeeBeans] = useState<number>(0);
  const [initialDose, setInitialDose] = useState<number>(0);
  const [yieldAmount, setYieldAmount] = useState<number>(0);
  const [grinderSetting, setGrinderSetting] = useState<number>(5);
  const [shots, setShots] = useState<number>(1);
  const [bagWeight, setBagWeight] = useState<number>(0);
  const [showBeansModal, setShowBeansModal] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [shotFinishedTime, setShotFinishedTime] = useState<number>(0);

  const supabase = createClient();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev < shotFinishedTime * 60) {
            return prev + 0.1; // Update more frequently for smoother animation
          } else {
            setIsTimerRunning(false);
            return prev;
          }
        });
      }, 100); // Reduced interval for smoother updates
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, shotFinishedTime]);

  // Rest of the calculation functions remain the same
  const calculateShotFinishedTime = () => {
    if (yieldAmount > 0 && initialDose > 0) {
      const ratio = yieldAmount / initialDose;
      const baseTime = 27;
      let adjustedTime = baseTime;
      if (ratio < 2) {
        adjustedTime = baseTime * (ratio / 2);
      } else if (ratio > 2.5) {
        adjustedTime = baseTime * (ratio / 2.5);
      }
      adjustedTime += preInfusionTime;
      const timeInMinutes = adjustedTime / 60;
      setShotFinishedTime(Number(timeInMinutes.toFixed(2)));
    } else {
      setShotFinishedTime(0);
    }
  };

  useEffect(() => {
    calculateShotFinishedTime();
  }, [yieldAmount, initialDose, preInfusionTime]);

  const handleSave = async () => {
    try {
      const journalEntry = {
        user_id: userId,
        pre_infusion_time: preInfusionTime,
        shot_finished_time: shotFinishedTime,
        coffee_beans: coffeeBeans,
        initial_dose: initialDose,
        yield_amount: yieldAmount,
        grinder_setting: grinderSetting,
        shots: shots,
        notes: notes,
        bag_weight: bagWeight,
      };

      const { data, error } = await supabase
        .from('espresso')
        .insert(journalEntry);

      if (error) throw error;

      alert('Journal entry saved successfully!');
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      alert(`Failed to save journal entry. Error: ${error.message}`);
    }
  };

  const handleAddBeans = (beansData: { coffeeName: string; bagWeight: number } | null) => {
    if (beansData) {
      setCoffeeBeans(Number(beansData.coffeeName));
      setBagWeight(beansData.bagWeight);
    }
    setShowBeansModal(false);
  };

  const handleStartTimer = () => {
    setElapsedTime(0);
    setIsTimerRunning(true);
  };

  const fillPercentage = elapsedTime / (shotFinishedTime * 60);

  return (
    <motion.div 
      className="max-w-4xl mx-auto bg-[#E6D5B8] text-[#4A2C2A] rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className="flex justify-center items-center mb-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative w-64 h-64 flex items-center justify-center bg-[#D4A373] rounded-full border-4 border-[#9C6644]">
          <motion.div
            className="absolute inset-0 bg-[#9C6644] bg-opacity-50 rounded-full origin-center"
            animate={{
              scale: [1, 1.02, 1],
              clipPath: `circle(${fillPercentage * 50}% at 50% 50%)`
            }}
            transition={{
              clipPath: { duration: 0.8, ease: "easeInOut" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          <motion.div 
            className="text-center z-10"
            animate={{ scale: isTimerRunning ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: isTimerRunning ? Infinity : 0, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.p 
                key={coffeeBeans}
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {coffeeBeans > 0 ? `${coffeeBeans}g` : 'Add Beans'}
              </motion.p>
            </AnimatePresence>
            <motion.p 
              className="text-xl"
              animate={{ opacity: isTimerRunning ? 1 : 0.7 }}
            >
              {elapsedTime.toFixed(1)} sec
            </motion.p>
            <p className="text-xl font-bold">{shotFinishedTime.toFixed(2)} mins</p>
            <motion.button 
              onClick={handleStartTimer} 
              className="mt-2 bg-[#9C6644] text-white px-4 py-2 rounded-full hover:bg-[#7F5539] transition-colors"
              whileHover={{ scale: 1.05, backgroundColor: "#7F5539" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Start
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <InputCard label="Coffee (g)" value={coffeeBeans} onChange={(e) => setCoffeeBeans(Number(e.target.value))} />
        <InputCard label="Yield (g)" value={yieldAmount} onChange={(e) => setYieldAmount(Number(e.target.value))} />
        <InputCard label="Grinder" value={grinderSetting} onChange={(e) => setGrinderSetting(Number(e.target.value))} />
        <InputCard label="Pre-Infusion Time (s)" value={preInfusionTime} onChange={(e) => setPreInfusionTime(Number(e.target.value))} />
        <InputCard label="Shots" value={shots} onChange={(e) => setShots(Number(e.target.value))} />
        <InputCard label="Initial Dose (g)" value={initialDose} onChange={(e) => setInitialDose(Number(e.target.value))} />
        <InputCard label="Bag Weight (g)" value={bagWeight} onChange={(e) => setBagWeight(Number(e.target.value))} className="col-span-2" />
        
        <div className="col-span-2">
          <label className="block text-xl font-bold mb-2">Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 bg-white border border-[#9C6644] rounded text-[#4A2C2A]"
            rows={4}
          />
        </div>

        <motion.button
          onClick={() => setShowBeansModal(true)}
          className="col-span-2 w-full bg-[#9C6644] text-white p-4 rounded-lg hover:bg-[#7F5539] transition-colors"
          whileHover={{ scale: 1.02, backgroundColor: "#7F5539" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          Add Beans
        </motion.button>

        <motion.button
          onClick={handleSave}
          className="col-span-2 w-full bg-[#9C6644] text-white p-4 rounded-lg hover:bg-[#7F5539] transition-colors"
          whileHover={{ scale: 1.02, backgroundColor: "#7F5539" }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          Save Journal Entry
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showBeansModal && <BeansModal onClose={handleAddBeans} />}
      </AnimatePresence>
    </motion.div>
  );
};

interface InputCardProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputCard: React.FC<InputCardProps> = ({ label, value, onChange, className = "" }) => (
  <motion.div 
    className={`bg-white p-4 rounded-lg shadow ${className}`}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <label className="block text-xl font-bold mb-2">{label}:</label>
    <input
      type="number"
      value={isNaN(value) ? '' : value}
      onChange={onChange}
      className="w-full p-2 bg-[#E6D5B8] border border-[#9C6644] rounded text-[#4A2C2A]"
    />
  </motion.div>
);

export default EspressoJournalClient;
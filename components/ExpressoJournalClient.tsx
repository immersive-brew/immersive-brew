"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
            return prev + 1;
          } else {
            setIsTimerRunning(false);
            return prev;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, shotFinishedTime]);

  const calculateShotFinishedTime = () => {
    if (yieldAmount > 0 && initialDose > 0) {
      // Use a typical espresso brewing ratio (1:2 to 1:2.5)
      const ratio = yieldAmount / initialDose;
      
      // Base time for espresso shot (typically 25-30 seconds)
      const baseTime = 27;
      
      // Adjust time based on the ratio
      let adjustedTime = baseTime;
      if (ratio < 2) {
        // Shorter time for ristretto-style shots
        adjustedTime = baseTime * (ratio / 2);
      } else if (ratio > 2.5) {
        // Longer time for lungo-style shots
        adjustedTime = baseTime * (ratio / 2.5);
      }

      // Add pre-infusion time
      adjustedTime += preInfusionTime;

      // Convert to minutes
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

      console.log('Attempting to save journal entry:', journalEntry);

      const { data, error } = await supabase
        .from('espresso')
        .insert(journalEntry);

      if (error) throw error;

      console.log('Journal entry saved successfully', data);
      alert('Journal entry saved successfully!');
    } catch (error: any) {
      console.error('Error saving journal entry', error);
      console.error('Error details:', error.message, error.details, error.hint);
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
    <div className="max-w-4xl mx-auto bg-[#E6D5B8] text-[#4A2C2A] rounded-lg shadow-lg p-6">
      <motion.div 
        className="flex justify-center items-center mb-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-64 h-64 flex items-center justify-center bg-[#D4A373] rounded-full border-4 border-[#9C6644]">
          <motion.div
            className="absolute inset-0 bg-[#9C6644] bg-opacity-50 rounded-full"
            style={{
              clipPath: `circle(${fillPercentage * 50}% at 50% 50%)`,
            }}
            transition={{ duration: 0.5 }}
          />
          <div className="text-center z-10">
            <p className="text-3xl font-bold">{coffeeBeans > 0 ? `${coffeeBeans}g` : 'Add Beans'}</p>
            <p className="text-xl">{elapsedTime.toFixed(2)} sec</p>
            <p className="text-xl font-bold">{shotFinishedTime.toFixed(2)} mins</p>
            <motion.button 
              onClick={handleStartTimer} 
              className="mt-2 bg-[#9C6644] text-white px-4 py-2 rounded-full hover:bg-[#7F5539] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add Beans
        </motion.button>

        <motion.button
          onClick={handleSave}
          className="col-span-2 w-full bg-[#9C6644] text-white p-4 rounded-lg hover:bg-[#7F5539] transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Journal Entry
        </motion.button>
      </div>

      {showBeansModal && <BeansModal onClose={handleAddBeans} />}
    </div>
  );
};

interface InputCardProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputCard: React.FC<InputCardProps> = ({ label, value, onChange, className = "" }) => (
  <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
    <label className="block text-xl font-bold mb-2">{label}:</label>
    <input
      type="number"
      value={isNaN(value) ? '' : value}
      onChange={onChange}
      className="w-full p-2 bg-[#E6D5B8] border border-[#9C6644] rounded text-[#4A2C2A]"
    />
  </div>
);

export default EspressoJournalClient;
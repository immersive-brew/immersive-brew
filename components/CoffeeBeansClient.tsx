"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import CoffeeBeansModal from './CoffeeBeansModal';

interface CoffeeBean {
  id: string;
  user_id: string;
  name: string;
  roaster: string;
  roast_date: string;
  roast_level: string;
  weight: number;
  varietal: string;
  processing_method: string;
  taste_notes: string;
  is_decaf: boolean;
  is_sample_beans: boolean;
  is_pre_ground: boolean;
  country: string;
  region: string;
  farm: string;
  altitude: string;
  grind_size: string;
  grinder_setting: string;
  beans_rating: number;
}

const CoffeeBeansClient = ({ userid }: { userid: string }) => {
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [showBeansModal, setShowBeansModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchCoffeeBeans();
  }, []);

  async function fetchCoffeeBeans() {
    const { data, error } = await supabase
      .from('coffee_beans')
      .select('*')
      .eq('user_id', userid);

    if (error) {
      console.error('Error fetching coffee beans:', error);
    } else {
      setCoffeeBeans(data || []);
    }
  }

  const handleAddBeans = async (beansData) => {
    const { data, error } = await supabase
      .from('coffee_beans')
      .insert([
        {
          user_id: userid,
          name: beansData.coffeeName,
          roaster: beansData.roasterName,
          roast_date: beansData.roastDate,
          roast_level: beansData.roasterLevel,
          weight: beansData.bagWeight,
          varietal: beansData.varietal,
          processing_method: beansData.processingMethod,
          taste_notes: beansData.tasteNotes,
          is_decaf: beansData.isDecaf,
          is_sample_beans: beansData.isSampleBeans,
          is_pre_ground: beansData.isPreGround,
          country: beansData.country,
          region: beansData.region,
          farm: beansData.farm,
          altitude: beansData.altitude,
          grind_size: beansData.grindSize,
          grinder_setting: beansData.grinderSetting,
          beans_rating: beansData.beansRating,
        },
      ]);

    if (error) {
      console.error('Error saving coffee beans:', error);
    } else {
      fetchCoffeeBeans();
    }
    setShowBeansModal(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-black text-white rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-bold mb-4">Coffee Beans</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {coffeeBeans.map((bean) => (
          <motion.div
            key={bean.id}
            className="bg-gray-800 p-4 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-xl font-semibold">{bean.name}</h2>
            <p>Roaster: {bean.roaster}</p>
            <p>Roast Date: {new Date(bean.roast_date).toLocaleDateString()}</p>
            <p>Roast Level: {bean.roast_level}</p>
            <p>Weight: {bean.weight}g</p>
            <p>Rating: {bean.beans_rating}/5</p>
            {bean.is_decaf && <p className="text-yellow-500">Decaf</p>}
            {bean.is_sample_beans && <p className="text-blue-500">Sample Beans</p>}
            {bean.is_pre_ground && <p className="text-green-500">Pre-Ground</p>}
          </motion.div>
        ))}
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowBeansModal(true)}
          className="w-full bg-[#D4A373] text-black p-4 rounded-lg hover:bg-[#c78d5d] transition-all"
        >
          Add Coffee Beans
        </button>
      </div>

      {showBeansModal && (
        <CoffeeBeansModal
          onClose={(beansData) => {
            if (beansData) {
              handleAddBeans(beansData);
            } else {
              setShowBeansModal(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default CoffeeBeansClient;
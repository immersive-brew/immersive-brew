"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CoffeeBeansModal from './CoffeeBeansModal';
import { createClient } from '@/utils/supabase/client';
import CoffeeBeanDelete from './CoffeeBeanDelete';

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
  altitude: number;
  grinder_type: string;
  grinder_setting: number;
  grind_size: string;
  beans_rating: number;
}

const CoffeeBeansClient = ({ userid }: { userid: string }) => {
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [showBeansModal, setShowBeansModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (userid) {
      fetchCoffeeBeans();
    }
  }, [userid]);

  async function fetchCoffeeBeans() {
    try {
      const { data, error } = await supabase
        .from('coffeebeans')
        .select('*')
        .eq('user_id', userid);

      if (error) {
        throw error;
      }

      setCoffeeBeans(data || []);
    } catch (error) {
      console.error('Error fetching coffee beans:', error);
      setError('Failed to fetch coffee beans. Please try again.');
    }
  }

  const handleAddBeans = async (beansData: any) => {
    try {
      // Log the received data
      console.log('Received beans data:', JSON.stringify(beansData, null, 2));

      const { data, error } = await supabase
        .from('coffeebeans')
        .insert([
          {
            user_id: userid,
            name: beansData.coffeeName,
            roaster: beansData.roasterName,
            roast_date: beansData.roastDate,
            roast_level: beansData.roastLevel,
            weight: beansData.bagWeight,
            varietal: beansData.varietal,
            processing_method: beansData.processingMethod,
            taste_notes: Array.isArray(beansData.tasteNotes) ? beansData.tasteNotes.join(', ') : beansData.tasteNotes,
            is_decaf: beansData.isDecaf,
            is_sample_beans: beansData.isSampleBeans,
            is_pre_ground: beansData.isPreGround,
            country: beansData.country,
            region: beansData.region,
            farm: beansData.farm,
            altitude: beansData.altitude,
            grind_size: beansData.grindSize,
            grinder_type: beansData.grinderType,
            grinder_setting: beansData.grinderSetting,
            beans_rating: beansData.beansRating,
          },
        ]);

      if (error) {
        throw error;
      }

      await fetchCoffeeBeans(); // Refresh the list after adding
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Error saving coffee beans:', JSON.stringify(error, null, 2));
      setError('Failed to save coffee beans. Please try again.');
    }
  };

  const handleDeleteBean = (deletedBeanId: string) => {
    setCoffeeBeans((prevBeans) => prevBeans.filter((bean) => bean.id !== deletedBeanId));
  };

  const handleModalClose = (beansData?: any) => {
    if (beansData) {
      handleAddBeans(beansData);
    }
    setShowBeansModal(false); // Close modal after saving or cancel
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-[#E6D5B8] text-[#4A2C2A] rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-bold mb-4 flex items-center justify-center">
        <span className="mr-2">☕</span>
        Coffee Beans
        <span className="ml-2">☕</span>
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {coffeeBeans.map((bean) => (
          <motion.div
            key={bean.id}
            className="relative bg-[#C7A17A] p-4 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CoffeeBeanDelete beanId={bean.id} onDelete={handleDeleteBean} />
            <h2 className="text-xl font-semibold">{bean.name}</h2>
            <p>Roaster: {bean.roaster}</p>
            <p>Roast Date: {new Date(bean.roast_date).toLocaleDateString()}</p>
            <p>Roast Level: {bean.roast_level}</p>
            <p>Weight: {bean.weight}g</p>
            <p>Rating: {bean.beans_rating}/5</p>
            {bean.is_decaf && <p className="text-[#B85C38]">Decaf</p>}
            {bean.is_sample_beans && <p className="text-[#5C3D2E]">Sample Beans</p>}
            {bean.is_pre_ground && <p className="text-[#2D4263]">Pre-Ground</p>}
            {bean.country && <p>Origin: {bean.country}{bean.region ? `, ${bean.region}` : ''}</p>}
            {bean.altitude > 0 && <p>Altitude: {bean.altitude}m</p>}
            {bean.varietal && <p>Varietal: {bean.varietal}</p>}
            {bean.processing_method && <p>Processing: {bean.processing_method}</p>}
            {bean.taste_notes && <p>Taste Notes: {bean.taste_notes}</p>}
            {bean.grinder_type && (
              <p>Grinder: {bean.grinder_type}, Setting: {bean.grinder_setting}, Size: {bean.grind_size}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowBeansModal(true)}
          className="w-full bg-[#9C6644] text-white p-4 rounded-lg hover:bg-[#7F5539] transition-all"
        >
          Add Coffee Beans
        </button>
      </div>

      {showBeansModal && (
        <CoffeeBeansModal
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default CoffeeBeansClient;

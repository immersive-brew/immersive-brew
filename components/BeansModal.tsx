import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BeansModalProps {
  onClose: (data: { coffeeName: string; bagWeight: number } | null) => void;
}

const BeansModal: React.FC<BeansModalProps> = ({ onClose }) => {
  const [coffeeName, setCoffeeName] = useState<string>('');
  const [bagWeight, setBagWeight] = useState<number>(0);

  const handleSave = () => {
    if (coffeeName && bagWeight > 0) {
      onClose({ coffeeName, bagWeight });
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-[#E6D5B8] p-6 rounded-lg w-full max-w-md"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#4A2C2A]">Add Coffee Beans</h2>
        
        <div className="mb-4">
          <label className="block text-[#4A2C2A] text-sm font-bold mb-2" htmlFor="coffeeName">
            Coffee Name:
          </label>
          <input
            id="coffeeName"
            type="text"
            value={coffeeName}
            onChange={(e) => setCoffeeName(e.target.value)}
            className="w-full p-2 bg-white border border-[#9C6644] rounded text-[#4A2C2A]"
            placeholder="Enter coffee name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#4A2C2A] text-sm font-bold mb-2" htmlFor="bagWeight">
            Bag Weight (g):
          </label>
          <input
            id="bagWeight"
            type="number"
            value={bagWeight || ''}
            onChange={(e) => setBagWeight(Number(e.target.value))}
            className="w-full p-2 bg-white border border-[#9C6644] rounded text-[#4A2C2A]"
            placeholder="Enter bag weight"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <motion.button
            onClick={() => onClose(null)}
            className="px-4 py-2 bg-gray-300 text-[#4A2C2A] rounded hover:bg-gray-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSave}
            className="px-4 py-2 bg-[#9C6644] text-white rounded hover:bg-[#7F5539] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BeansModal;
// CoffeeGridItem.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface CoffeeGridItemProps {
  id: string;
  imageUrl: string;
  coffeeName: string;
  onClick: (id: string) => void;
}

const CoffeeGridItem: React.FC<CoffeeGridItemProps> = ({ id, imageUrl, coffeeName, onClick }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg shadow-md"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(id)}
    >
      <img
        src={imageUrl}
        alt={coffeeName}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
        {coffeeName}
      </div>
    </motion.div>
  );
};

export default CoffeeGridItem;

import React from 'react';
import { createClient } from '@/utils/supabase/client';

interface CoffeeBeanDeleteProps {
  beanId: string;
  onDelete: (id: string) => void;
}

const CoffeeBeanDelete: React.FC<CoffeeBeanDeleteProps> = ({ beanId, onDelete }) => {
  const supabase = createClient();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('coffeebeans')
        .delete()
        .eq('id', beanId);

      if (error) {
        throw error;
      }

      onDelete(beanId);
    } catch (error: any) {
      console.error('Error deleting coffee bean:', JSON.stringify(error, null, 2));
      alert('Failed to delete coffee bean. Please try again.');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="absolute top-2 right-2 p-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-all"
    >
      ✕
    </button>
  );
};

export default CoffeeBeanDelete;

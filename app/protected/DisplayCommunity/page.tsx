// DisplayCommunity.tsx

"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import CoffeeGridItem from "@/components/CoffeeGridItem";

interface CoffeeBean {
  id: string;
  image_url: string;
  name: string;
}

const DisplayCommunity = () => {
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchCommunityCoffeeBeans();
  }, []);

  async function fetchCommunityCoffeeBeans() {
    try {
      const { data, error } = await supabase.from("coffeebeans").select("id, image_url, name");

      if (error) {
        throw error;
      }

      setCoffeeBeans(data || []);
    } catch (error) {
      console.error("Error fetching community coffee beans:", error);
      setError("Failed to load coffee beans. Please try again later.");
    }
  }

  const handleItemClick = (id: string) => {
    console.log(`Coffee Bean clicked: ${id}`);
    // Additional logic to navigate to a detailed page or show a modal
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#F3F2EF] text-[#4A2C2A] rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-bold mb-6">Explore Coffee Community</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {coffeeBeans.map((bean) => (
          <CoffeeGridItem
            key={bean.id}
            id={bean.id}
            imageUrl={bean.image_url}
            coffeeName={bean.name}
            onClick={handleItemClick}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCommunity;

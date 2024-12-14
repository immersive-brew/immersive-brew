"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface CoffeeBean {
  id: string;
  image_url: string;
  name: string;
  beans_rating?: number;
}

const DisplayCommunity = () => {
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [selectedBean, setSelectedBean] = useState<CoffeeBean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchCommunityCoffeeBeans();
  }, []);

  async function fetchCommunityCoffeeBeans() {
    try {
      const { data, error } = await supabase
        .from("coffeebeans")
        .select("id, image_url, name, beans_rating")
        .not("image_url", "is", null);

      if (error) {
        throw error;
      }

      setCoffeeBeans(data || []);
    } catch (error) {
      console.error("Error fetching community coffee beans:", error);
      setError("Failed to load coffee beans. Please try again later.");
    }
  }

  const handleItemClick = (bean: CoffeeBean) => {
    setSelectedBean(bean); // Set the clicked bean as selected
  };

  const closeModal = () => {
    setSelectedBean(null); // Clear the selected bean to close the modal
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#F3F2EF] text-[#4A2C2A] rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-bold mb-6">Explore Coffee Community</h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {coffeeBeans.map((bean) => (
          <div
            key={bean.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => handleItemClick(bean)}
          >
            <img
              src={bean.image_url}
              alt={bean.name}
              className="w-full h-32 object-cover rounded"
            />
            <h3 className="mt-2 text-lg font-bold text-[#4A2C2A] truncate">
              {bean.name}
            </h3>

            {bean.beans_rating !== undefined && (
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= bean.beans_rating
                        ? "text-[#FFD700] text-xl"
                        : "text-gray-300 text-xl"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Full Name */}
      {selectedBean && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#4A2C2A]">
              {selectedBean.name}
            </h2>
            <img
              src={selectedBean.image_url}
              alt={selectedBean.name}
              className="w-full h-40 object-cover rounded"
            />
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-[#9C6644] text-white rounded hover:bg-[#7F5539] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayCommunity;

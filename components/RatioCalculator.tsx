"use client"; // Make this a client-side component

import { useState } from "react";

export default function RatioCalculator() {
  const [waterAmount, setWaterAmount] = useState<string>("");
  const [coffeeAmount, setCoffeeAmount] = useState<string>("");
  const [ratio, setRatio] = useState("-");

  // Update the ratio when the water or coffee amount changes
  const updateRatio = (water: number, coffee: number) => {
    if (water && coffee && coffee !== 0) {
      setRatio((water / coffee).toFixed(2));
    } else {
      setRatio("-");
    }
  };

  const handleWaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const water = parseFloat(e.target.value);
    setWaterAmount(e.target.value);
    updateRatio(water, parseFloat(coffeeAmount));
  };

  const handleCoffeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const coffee = parseFloat(e.target.value);
    setCoffeeAmount(e.target.value);
    updateRatio(parseFloat(waterAmount), coffee);
  };

  return (
    <div className="mt-8">
      <form className="flex flex-col gap-4 items-center">
        {/* Water Amount */}
        <div className="flex flex-col">
          <label htmlFor="waterAmount" className="font-semibold">Water (in grams)</label>
          <input
            type="number"
            id="waterAmount"
            name="waterAmount"
            value={waterAmount}
            onChange={handleWaterChange}
            className="p-2 border rounded"
            placeholder="e.g., 250"
            min="1"
            max="1000"
          />
        </div>

        {/* Coffee Amount */}
        <div className="flex flex-col">
          <label htmlFor="coffeeAmount" className="font-semibold">Coffee (in grams)</label>
          <input
            type="number"
            id="coffeeAmount"
            name="coffeeAmount"
            value={coffeeAmount}
            onChange={handleCoffeeChange}
            className="p-2 border rounded"
            placeholder="e.g., 15"
            min="1"
            max="100"
          />
        </div>
      </form>

      {/* Display Water-to-Coffee Ratio */}
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold">Water-to-Coffee Ratio</p>
        <p className="text-2xl font-bold">{ratio}</p>
        <p className="text-sm">Ideal range: 15:1 to 18:1</p>
      </div>
    </div>
  );
}

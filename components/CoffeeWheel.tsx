"use client";
import React, { useState } from 'react';

const coffeeRecommendations = {
  "Dull": {
    advice: "Use a finer grind and extract more.",
    output: "Richer, more complex cup of coffee."
  },
  "Savoury": {
    advice: "Use a finer grind or more brew time.",
    output: "More balanced and flavorful."
  },
  "Powdery": {
    advice: "Use a coarser grind or less coffee.",
    output: "More clarity and sweetness."
  },
  "Bitter": {
    advice: "Extract Less, Use More Coffee.",
    output: "Richer, Fruitier Cup of Coffee."
  },
  "Strong": {
    advice: "Use less coffee or more water.",
    output: "Milder, less overwhelming taste."
  },
  "Heavy": {
    advice: "Reduce brew time or coffee amount.",
    output: "A smoother, lighter cup."
  },
  "Pleasant": {
    advice: "Perfect extraction! Keep brewing the same.",
    output: "The best possible flavor!"
  },
  "Intense": {
    advice: "Use a coarser grind and less coffee.",
    output: "Balanced, less overpowering."
  },
  "Overwhelming": {
    advice: "Extract less, use a coarser grind.",
    output: "Balanced and less bitter."
  }
};

const CoffeeWheel: React.FC = () => {
  const [selectedTaste, setSelectedTaste] = useState<string>('Bitter');

  const handleTasteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTaste(event.target.value);
  };

  const { advice, output } = coffeeRecommendations[selectedTaste];

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>How was your coffee?</h2>
      <select
        value={selectedTaste}
        onChange={handleTasteChange}
        style={{ padding: '10px', fontSize: '16px' }}
      >
        {Object.keys(coffeeRecommendations).map((taste) => (
          <option key={taste} value={taste}>
            {taste}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        <p><strong>You should:</strong> {advice}</p>
        <p><strong>Expected Output:</strong> {output}</p>
      </div>
    </div>
  );
};

export default CoffeeWheel;

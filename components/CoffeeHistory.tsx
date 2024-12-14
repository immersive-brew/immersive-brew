import React from "react";

interface CoffeeHistoryProps {
  coffeeTypes: {
    name: string;
    description: string;
    imageUrl: string;
  }[];
  title: string;
}

const CoffeeHistory: React.FC<CoffeeHistoryProps> = ({ coffeeTypes, title }) => {
  return (
    <div className="mt-10 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {coffeeTypes.map((type, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
            <img
              src={type.imageUrl}
              alt={type.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{type.name}</h3>
              <p className="text-gray-700">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoffeeHistory;

// components/BlindTestResults.tsx

import React from "react";
import { CoffeeBean } from "@/types";

interface BlindTestResultsProps {
  feedback: { [key: number]: string };
  beans: CoffeeBean[];
}

const BlindTestResults: React.FC<BlindTestResultsProps> = ({ feedback, beans }) => {
  const selectedBeanIds = Object.keys(feedback).map((id) => parseInt(id, 10));
  const selectedBeans = beans.filter((bean) => selectedBeanIds.includes(bean.id));

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Test Results</h3>
      {selectedBeans.map((bean) => (
        <div key={bean.id} className="mb-4 p-4 border rounded-md bg-gray-50">
          <h4 className="text-lg font-bold">{bean.name}</h4>
          <p>Roaster: {bean.roaster}</p>
          <p>Roast Level: {bean.roast_level}</p>
          <p className="mt-2"><strong>Your Feedback:</strong></p>
          <p>{feedback[bean.id]}</p>
        </div>
      ))}
    </div>
  );
};

export default BlindTestResults;

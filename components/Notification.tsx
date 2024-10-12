"use client";
import { useState } from "react";
import CoffeeIntake from "./CoffeeIntake";
import { createPortal } from "react-dom";

export default function Notification() {
  // Set the initial state to true so the popup appears on page load
  const [showPopup, setShowPopup] = useState(true);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <>
      {showPopup &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Coffee Intake Notification</h3>
              <CoffeeIntake />
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={togglePopup}
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

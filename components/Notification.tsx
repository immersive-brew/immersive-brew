"use client";
import { useState } from "react";
import CoffeeIntake from "./CoffeeIntake";
import { createPortal } from "react-dom";

export default function Notification() {
  // Set the initial state to false so the popup appears only when the button is pressed
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <CoffeeIntake />
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}

      {!showPopup && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={togglePopup}
        >
          Open Notification
        </button>
      )}
    </>
  );
}
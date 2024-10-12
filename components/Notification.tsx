"use client";
import { useState } from "react";
import CoffeeIntake from "./CoffeeIntake";
import { createPortal } from "react-dom";

export default function Notification() {
  const [showNotification, setShowNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Notification</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={toggleNotification}
      >
        {showNotification ? "Hide Coffee Intake" : "Show Coffee Intake"}
      </button>
      {showNotification && <CoffeeIntake />}

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={togglePopup}
      >
        {showPopup ? "Close Popup" : "Show Popup"}
      </button>
      {showPopup && createPortal(
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
    </div>
  );
}
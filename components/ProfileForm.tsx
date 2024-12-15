"use client";

import { useState, useEffect } from "react";
import { SaveButton } from "@/components/save-button";

export default function ProfileForm({ profile }) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [measurementUnit, setMeasurementUnit] = useState(profile?.measurement_unit || "grams");
  const [showForm, setShowForm] = useState(false); // Toggle to show/hide form
  const id = profile?.id;

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleUnitChange = (e) => {
    setMeasurementUnit(e.target.value);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <button
        onClick={handleShowForm}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {showForm ? "Cancel" : "Change Profile"}
      </button>

      {showForm && (
        <div className="mt-4">
          {/* Full Name Input */}
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Measurement Unit Selection */}
          <div className="mb-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Measurement Unit
            </span>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="measurementUnit"
                  value="grams"
                  checked={measurementUnit === "grams"}
                  onChange={handleUnitChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Grams</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="measurementUnit"
                  value="ounces"
                  checked={measurementUnit === "ounces"}
                  onChange={handleUnitChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Ounces</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <SaveButton
            id={id}
            fullName={fullName}
            unit={measurementUnit}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Save
          </SaveButton>
        </div>
      )}
    </div>
  );
}

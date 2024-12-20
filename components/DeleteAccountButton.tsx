"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function DeleteAccountButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.rpc("delete_user");

      if (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete your account.");
      } else {
        router.push("/"); // Redirect on successful deletion
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsConfirmed(false);
  };

  return (
    <div>
      {/* Main Delete Account Button */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-[#b3594e] text-white font-bold rounded hover:bg-[#944943] focus:ring-4 focus:ring-[#c2726b] transition duration-200"
      >
        Delete Account
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <h2 className="text-xl font-semibold text-center text-[#b3594e] mb-4">
              Confirm Account Deletion
            </h2>
            <p className="text-gray-700 text-center mb-6">
              Deleting your account is irreversible. Please confirm your
              understanding.
            </p>

            {/* Confirmation Checkbox */}
            <div className="flex items-center justify-center mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="w-5 h-5 border-gray-300 rounded focus:ring-[#b3594e] text-[#b3594e]"
                />
                <span className="text-gray-800">
                  I understand that this action is permanent.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={!isConfirmed}
                className={`px-4 py-2 font-bold rounded transition duration-200 ${
                  isConfirmed
                    ? "bg-[#b3594e] text-white hover:bg-[#944943] focus:ring-4 focus:ring-[#c2726b]"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

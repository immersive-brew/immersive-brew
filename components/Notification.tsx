"use client";
import { useState, useEffect } from "react";
import CoffeeIntake from "./CoffeeIntake";
import { createPortal } from "react-dom";
import { createClient } from "@/utils/supabase/client";

export default function Notification() {
  const [showPopup, setShowPopup] = useState(true);
  const [latestBrew, setLatestBrew] = useState(null);
  const [latestFeedback, setLatestFeedback] = useState(null);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        // Fetch latest brew
        const { data: brewData, error: brewError } = await supabase
          .from("entries")
          .select("*")
          .eq("userid", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (brewError) {
          console.error("Error fetching latest brew:", brewError);
        } else {
          setLatestBrew(brewData);
        }

        // Fetch latest_feedback from profiles
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("latest_feedback")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile latest_feedback:", profileError);
        } else {
          setLatestFeedback(profileData?.latest_feedback || null);
        }
      }
    };

    fetchData();
  }, [user, supabase]);

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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {latestBrew && (
                <div className="text-green-700 font-bold mb-4">
                  Latest Brew was on{" "}
                  {new Date(latestBrew.created_at).toLocaleString()}
                </div>
              )}

              {latestFeedback && (
                <div className="mb-4">
                  <h2 className="font-bold text-xl mb-2">Latest Feedback</h2>
                  <p>
                    <strong>Feedback User:</strong> {latestFeedback.feedback_user}
                  </p>
                  <p>
                    <strong>Suggestion:</strong>{" "}
                    {latestFeedback.feedback_suggestion}
                  </p>
                  <p>
                    <strong>Expected Output:</strong>{" "}
                    {latestFeedback.feedback_expected_output}
                  </p>
                </div>
              )}

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
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-full shadow-lg"
          onClick={togglePopup}
          aria-label="Open Notification"
        >
          {/* A simple bell icon (SVG). Replace with any icon you prefer. */}
          <svg
            className="w-6 h-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a6 6 0 0 0-6 6v3l-.7 2.3a1 1 0 0 0 .9 1.2h11.6a1 1 0 0 0 .9-1.2L16 11V8a6 6 0 0 0-6-6zm0 16a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2z" />
          </svg>
        </button>
      )}
    </>
  );
}

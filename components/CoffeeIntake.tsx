"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CoffeeIntake() {
  const [totalCaffeine, setTotalCaffeine] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch user ID when the component mounts
  const fetchUserId = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user ID:", error.message);
      return;
    }
    if (data?.user?.id) {
      setUserId(data.user.id);
    }
  };

  // Fetch coffee intake for the logged-in user
  const fetchCoffeeIntake = async () => {
    if (!userId) {
      console.error("No user ID found. Unable to fetch data.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("entries")
      .select("coffee_weight, created_at")
      .eq("userid", userId) // Filter by the logged-in user's ID
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Filter by the last 24 hours

    if (error) {
      console.error("Error fetching coffee intake:", error);
    } else {
      let totalWeight = 0;
      if (data && data.length > 0) {
        data.forEach((entry) => {
          if (entry.coffee_weight) {
            totalWeight += entry.coffee_weight;
          }
        });
      }
      // Convert coffee weight to caffeine (assuming 10mg of caffeine per gram of coffee)
      const caffeine = totalWeight * 10;
      setTotalCaffeine(caffeine);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCoffeeIntake();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const averageCaffeineIntake = 400; // Average daily caffeine intake in mg for an adult
  const comparison = totalCaffeine !== null ? (totalCaffeine > averageCaffeineIntake ? "above" : "below") : "";

  return (
    <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Coffee Intake</h2>
      <p className="text-center text-gray-600 mb-6">
        Total caffeine intake in the last 24 hours: <span className="font-bold">{totalCaffeine || 0} mg</span>
      </p>
      <p className="text-center text-gray-600 mb-6">
        This is <span className="font-bold">{comparison}</span> the average daily caffeine intake of 400 mg.
      </p>
    </div>
  );
}

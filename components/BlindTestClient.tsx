// components/BlindTestClient.tsx

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define the CoffeeBean type within this file
interface CoffeeBean {
  id: number;
  name: string;
  roaster: string;
  roast_level: string;
}

// Define the step types
type Step = "selection" | "test" | "results";

// Define the attributes to be rated
interface Attributes {
  flavor: number;
  aroma: number;
  acidity: number;
  body: number;
}

export default function BlindTestClient() {
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [selectedBeans, setSelectedBeans] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [step, setStep] = useState<Step>("selection");
  const [testOrder, setTestOrder] = useState<CoffeeBean[]>([]);
  const [attributeRatings, setAttributeRatings] = useState<{
    [key: number]: Attributes;
  }>({});

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Function to create Supabase client
  function createClient(url: string, key: string) {
    const { createClient: supabaseCreateClient } = require("@supabase/supabase-js");
    return supabaseCreateClient(url, key);
  }

  useEffect(() => {
    // Fetch all beans on component mount
    const fetchBeans = async () => {
      try {
        const { data, error } = await supabase
          .from("coffeebeans")
          .select("id, name, roaster, roast_level");

        if (error) {
          console.error("Error fetching beans:", error);
          setError("Failed to fetch coffee beans.");
        } else {
          setBeans(data as CoffeeBean[]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBeans();
  }, [supabase]);

  const handleBeanSelect = (beanId: number) => {
    setSelectedBeans((prevSelected) => {
      if (prevSelected.includes(beanId)) {
        // Deselect bean
        const { [beanId]: _, ...rest } = attributeRatings;
        setAttributeRatings(rest);
        return prevSelected.filter((id) => id !== beanId);
      } else if (prevSelected.length < 2) {
        // Select bean and initialize ratings
        setAttributeRatings((prev) => ({
          ...prev,
          [beanId]: { flavor: 5, aroma: 5, acidity: 5, body: 5 }, // Default rating
        }));
        return [...prevSelected, beanId];
      }
      return prevSelected; // Do not allow more than 2 selections
    });
  };

  const handleStartTest = () => {
    const selected = beans.filter((bean) => selectedBeans.includes(bean.id));
    if (selected.length !== 2) {
      setError("Please select exactly two beans to start the test.");
      return;
    }
    // Randomize the order
    const randomized = [...selected].sort(() => Math.random() - 0.5);
    setTestOrder(randomized);
    setStep("test");
  };

  const handleAttributeChange = (
    beanId: number,
    attribute: keyof Attributes,
    value: number
  ) => {
    setAttributeRatings((prev) => ({
      ...prev,
      [beanId]: {
        ...prev[beanId],
        [attribute]: value,
      },
    }));
  };

  const handleCompleteTest = async () => {
    // Ensure all ratings are provided
    if (selectedBeans.length !== 2) {
      setError("Please select exactly two beans to complete the test.");
      return;
    }

    // Optionally, save the ratings to the database here
    // Example:
    /*
    try {
      const ratingsEntries = testOrder.map((bean) => ({
        bean_id: bean.id,
        flavor: attributeRatings[bean.id]?.flavor,
        aroma: attributeRatings[bean.id]?.aroma,
        acidity: attributeRatings[bean.id]?.acidity,
        body: attributeRatings[bean.id]?.body,
      }));

      const { error } = await supabase
        .from("blind_test_feedback")
        .insert(ratingsEntries);

      if (error) {
        console.error("Error saving ratings:", error);
        setError("Failed to save your ratings. Please try again.");
        return;
      }

      setStep("results");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while saving your ratings.");
    }
    */

    // For demonstration, we'll proceed to results without saving
    setStep("results");
  };

  const handleRestartTest = () => {
    setSelectedBeans([]);
    setTestOrder([]);
    setAttributeRatings({});
    setStep("selection");
    setError(null);
  };

  // Inline Instructions Section
  const renderInstructions = () => (
    <div className="p-4 border rounded-md bg-yellow-50">
      <h3 className="text-lg font-semibold mb-2">Instructions</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Select two coffee beans you want to compare.</li>
        <li>Start the blind test to evaluate each bean.</li>
        <li>Rate each attribute using the sliders provided.</li>
        <li>View the results of your blind test.</li>
      </ul>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleStartTest}
          className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          Begin Test
        </button>
      </div>
    </div>
  );

  // Inline Results Section with Sliders
  const renderResults = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Test Results</h3>
      {testOrder.map((bean) => (
        <div key={bean.id} className="mb-6 p-4 border rounded-md bg-gray-50">
          <h4 className="text-lg font-bold mb-2">{bean.name}</h4>
          <p className="mb-4">Roaster: {bean.roaster}</p>
          <div className="space-y-4">
            {/* Flavor Slider */}
            <div>
              <label htmlFor={`flavor-${bean.id}`} className="block text-sm font-medium text-gray-700">
                Flavor: {attributeRatings[bean.id]?.flavor}
              </label>
              <input
                type="range"
                id={`flavor-${bean.id}`}
                name={`flavor-${bean.id}`}
                min="1"
                max="10"
                value={attributeRatings[bean.id]?.flavor || 5}
                onChange={(e) =>
                  handleAttributeChange(bean.id, "flavor", parseInt(e.target.value))
                }
                className="w-full mt-1"
              />
            </div>

            {/* Aroma Slider */}
            <div>
              <label htmlFor={`aroma-${bean.id}`} className="block text-sm font-medium text-gray-700">
                Aroma: {attributeRatings[bean.id]?.aroma}
              </label>
              <input
                type="range"
                id={`aroma-${bean.id}`}
                name={`aroma-${bean.id}`}
                min="1"
                max="10"
                value={attributeRatings[bean.id]?.aroma || 5}
                onChange={(e) =>
                  handleAttributeChange(bean.id, "aroma", parseInt(e.target.value))
                }
                className="w-full mt-1"
              />
            </div>

            {/* Acidity Slider */}
            <div>
              <label htmlFor={`acidity-${bean.id}`} className="block text-sm font-medium text-gray-700">
                Acidity: {attributeRatings[bean.id]?.acidity}
              </label>
              <input
                type="range"
                id={`acidity-${bean.id}`}
                name={`acidity-${bean.id}`}
                min="1"
                max="10"
                value={attributeRatings[bean.id]?.acidity || 5}
                onChange={(e) =>
                  handleAttributeChange(bean.id, "acidity", parseInt(e.target.value))
                }
                className="w-full mt-1"
              />
            </div>

            {/* Body Slider */}
            <div>
              <label htmlFor={`body-${bean.id}`} className="block text-sm font-medium text-gray-700">
                Body: {attributeRatings[bean.id]?.body}
              </label>
              <input
                type="range"
                id={`body-${bean.id}`}
                name={`body-${bean.id}`}
                min="1"
                max="10"
                value={attributeRatings[bean.id]?.body || 5}
                onChange={(e) =>
                  handleAttributeChange(bean.id, "body", parseInt(e.target.value))
                }
                className="w-full mt-1"
              />
            </div>
          </div>
        </div>
      ))}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleRestartTest}
          className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Restart Test
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading coffee beans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto my-8"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Blind Test</h2>

      {step === "selection" && (
        <>
          <p className="text-center mb-4">
            Please select exactly two coffee beans for your blind test:
          </p>

          {/* Instructions Section */}
          <div className="mb-6">
            {renderInstructions()}
          </div>

          {/* Coffee Beans Selection */}
          <div className="space-y-4">
            <AnimatePresence>
              {beans.map((bean) => (
                <motion.div
                  key={bean.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 border rounded-md shadow-sm cursor-pointer transition-colors ${
                    selectedBeans.includes(bean.id)
                      ? "bg-gray-200 border-blue-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => handleBeanSelect(bean.id)}
                >
                  <h3 className="text-xl font-bold">{bean.name}</h3>
                  <p>Roaster: {bean.roaster}</p>
                  <p>Roast Level: {bean.roast_level}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Start Test Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleStartTest}
              disabled={selectedBeans.length !== 2}
              className={`px-6 py-2 rounded-md text-white ${
                selectedBeans.length === 2
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Start Blind Test
            </button>
          </div>
        </>
      )}

      {step === "test" && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Blind Test - Rate the Beans</h3>
          {testOrder.map((bean, index) => (
            <div key={bean.id} className="mb-6 p-4 border rounded-md">
              <h4 className="text-lg font-bold">Bean {index + 1}: {bean.name}</h4>
              <p className="mb-4">Roaster: {bean.roaster}</p>
              <div className="space-y-4">
                {/* Flavor Slider */}
                <div>
                  <label htmlFor={`flavor-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Flavor: {attributeRatings[bean.id]?.flavor}
                  </label>
                  <input
                    type="range"
                    id={`flavor-${bean.id}`}
                    name={`flavor-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.flavor || 5}
                    onChange={(e) =>
                      handleAttributeChange(bean.id, "flavor", parseInt(e.target.value))
                    }
                    className="w-full mt-1"
                  />
                </div>

                {/* Aroma Slider */}
                <div>
                  <label htmlFor={`aroma-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Aroma: {attributeRatings[bean.id]?.aroma}
                  </label>
                  <input
                    type="range"
                    id={`aroma-${bean.id}`}
                    name={`aroma-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.aroma || 5}
                    onChange={(e) =>
                      handleAttributeChange(bean.id, "aroma", parseInt(e.target.value))
                    }
                    className="w-full mt-1"
                  />
                </div>

                {/* Acidity Slider */}
                <div>
                  <label htmlFor={`acidity-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Acidity: {attributeRatings[bean.id]?.acidity}
                  </label>
                  <input
                    type="range"
                    id={`acidity-${bean.id}`}
                    name={`acidity-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.acidity || 5}
                    onChange={(e) =>
                      handleAttributeChange(bean.id, "acidity", parseInt(e.target.value))
                    }
                    className="w-full mt-1"
                  />
                </div>

                {/* Body Slider */}
                <div>
                  <label htmlFor={`body-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Body: {attributeRatings[bean.id]?.body}
                  </label>
                  <input
                    type="range"
                    id={`body-${bean.id}`}
                    name={`body-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.body || 5}
                    onChange={(e) =>
                      handleAttributeChange(bean.id, "body", parseInt(e.target.value))
                    }
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Complete Test Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCompleteTest}
              className={`px-6 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 ${
                selectedBeans.length !== 2
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={selectedBeans.length !== 2}
            >
              Complete Test
            </button>
          </div>
        </div>
      )}

      {step === "results" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <h3 className="text-2xl font-semibold text-center mb-6">Test Results with Attribute Ratings</h3>
          {testOrder.map((bean) => (
            <div key={bean.id} className="mb-6 p-4 border rounded-md bg-gray-50">
              <h4 className="text-lg font-bold mb-2">{bean.name}</h4>
              <p className="mb-4">Roaster: {bean.roaster}</p>
              <div className="space-y-4">
                {/* Flavor Slider (Read-Only) */}
                <div>
                  <label htmlFor={`flavor-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Flavor: {attributeRatings[bean.id]?.flavor}
                  </label>
                  <input
                    type="range"
                    id={`flavor-${bean.id}`}
                    name={`flavor-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.flavor || 5}
                    disabled
                    className="w-full mt-1 cursor-not-allowed"
                  />
                </div>

                {/* Aroma Slider (Read-Only) */}
                <div>
                  <label htmlFor={`aroma-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Aroma: {attributeRatings[bean.id]?.aroma}
                  </label>
                  <input
                    type="range"
                    id={`aroma-${bean.id}`}
                    name={`aroma-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.aroma || 5}
                    disabled
                    className="w-full mt-1 cursor-not-allowed"
                  />
                </div>

                {/* Acidity Slider (Read-Only) */}
                <div>
                  <label htmlFor={`acidity-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Acidity: {attributeRatings[bean.id]?.acidity}
                  </label>
                  <input
                    type="range"
                    id={`acidity-${bean.id}`}
                    name={`acidity-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.acidity || 5}
                    disabled
                    className="w-full mt-1 cursor-not-allowed"
                  />
                </div>

                {/* Body Slider (Read-Only) */}
                <div>
                  <label htmlFor={`body-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Body: {attributeRatings[bean.id]?.body}
                  </label>
                  <input
                    type="range"
                    id={`body-${bean.id}`}
                    name={`body-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.body || 5}
                    disabled
                    className="w-full mt-1 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleRestartTest}
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Restart Test
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

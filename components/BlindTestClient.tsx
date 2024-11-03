// components/BlindTestClient.tsx

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image"; // Ensure you're using Next.js or replace with 'img' if not

// Define the CoffeeBean type within this file
interface CoffeeBean {
  id: number;
  name: string;
  roaster: string;
  roast_level: string;
  created_at?: string; // Assuming there's a created_at field
}

// Define the step types
type Step = "selection" | "preparation" | "test" | "results";

// Define the attributes to be rated
interface Attributes {
  flavor: number;
  aroma: number;
  acidity: number;
  body: number;
  sweetness: number;
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
  const [preparationStepIndex, setPreparationStepIndex] = useState<number>(0);

  // Define the preparation steps with images
  const preparationSteps = [
    {
      instruction:
        "Grind beans finely and prepare equal cups to the number of beans selected. Put beans into the cups.",
      imageSrc: "/images/grind-beans.jpg", // Update the image paths accordingly
      altText: "Grinding coffee beans",
    },
    {
      instruction: "Boil water to 100 degrees Celsius.",
      imageSrc: "/images/boil-water.jpg",
      altText: "Boiling water",
    },
    {
      instruction: "Mix boiled water with ground beans in the cups.",
      imageSrc: "/images/mix-water-beans.jpg",
      altText: "Mixing water with ground beans",
    },
    {
      instruction:
        "Taste with a small spoon and focus on the attributes: flavor, aroma, acidity, body, and sweetness.",
      imageSrc: "/images/taste-coffee.jpg",
      altText: "Tasting coffee with a spoon",
    },
  ];

  // Initialize Supabase client
  const supabase = createClient();

 

  useEffect(() => {
    // Fetch all beans on component mount, sorted by recently added first
    const fetchBeans = async () => {
      try {
        const { data, error } = await supabase
          .from("coffeebeans")
          .select("id, name, roaster, roast_level, created_at")
          .order("created_at", { ascending: false });

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
          [beanId]: { flavor: 5, aroma: 5, acidity: 5, body: 5, sweetness: 5 }, // Default rating
        }));
        return [...prevSelected, beanId];
      }
      return prevSelected; // Do not allow more than 2 selections
    });
  };

  const handleStartPreparation = () => {
    const selected = beans.filter((bean) => selectedBeans.includes(bean.id));
    if (selected.length !== 2) {
      setError("Please select exactly two beans to start the test.");
      return;
    }
    // Randomize the order
    const randomized = [...selected].sort(() => Math.random() - 0.5);
    setTestOrder(randomized);
    setStep("preparation");
    setPreparationStepIndex(0);
  };

  const handleNextPreparationStep = () => {
    if (preparationStepIndex < preparationSteps.length - 1) {
      setPreparationStepIndex(preparationStepIndex + 1);
    } else {
      // All preparation steps completed
      setStep("test");
    }
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
        sweetness: attributeRatings[bean.id]?.sweetness,
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
        <li>Follow the preparation steps carefully.</li>
        <li>Rate each attribute using the sliders provided.</li>
        <li>View the results of your blind test.</li>
      </ul>
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
              onClick={handleStartPreparation}
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

      {step === "preparation" && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Preparation Steps</h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={preparationStepIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="p-4 border rounded-md bg-gray-50 text-center"
            >
              <div className="mb-4">
                <Image
                  src={preparationSteps[preparationStepIndex].imageSrc}
                  alt={preparationSteps[preparationStepIndex].altText}
                  width={400}
                  height={300}
                  className="mx-auto rounded-md"
                />
              </div>
              <p className="text-lg">{preparationSteps[preparationStepIndex].instruction}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex justify-center space-x-4">
            {preparationStepIndex > 0 && (
              <button
                onClick={() => setPreparationStepIndex(preparationStepIndex - 1)}
                className="px-6 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNextPreparationStep}
              className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              {preparationStepIndex < preparationSteps.length - 1 ? "Next" : "Proceed to Test"}
            </button>
          </div>
        </div>
      )}

      {step === "test" && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Blind Test - Rate the Beans</h3>
          {testOrder.map((bean, index) => (
            <div key={bean.id} className="mb-6 p-4 border rounded-md">
              <h4 className="text-lg font-bold">Bean {index + 1}</h4>
              {/* In a real blind test, you wouldn't show bean details. Here, it's simulated. */}
              <p className="mb-4">Taste the coffee and adjust the sliders to reflect your experience.</p>
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

                {/* Sweetness Slider */}
                <div>
                  <label htmlFor={`sweetness-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Sweetness: {attributeRatings[bean.id]?.sweetness}
                  </label>
                  <input
                    type="range"
                    id={`sweetness-${bean.id}`}
                    name={`sweetness-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.sweetness || 5}
                    onChange={(e) =>
                      handleAttributeChange(bean.id, "sweetness", parseInt(e.target.value))
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
              className={`px-6 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700`}
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

                {/* Sweetness Slider (Read-Only) */}
                <div>
                  <label htmlFor={`sweetness-${bean.id}`} className="block text-sm font-medium text-gray-700">
                    Sweetness: {attributeRatings[bean.id]?.sweetness}
                  </label>
                  <input
                    type="range"
                    id={`sweetness-${bean.id}`}
                    name={`sweetness-${bean.id}`}
                    min="1"
                    max="10"
                    value={attributeRatings[bean.id]?.sweetness || 5}
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

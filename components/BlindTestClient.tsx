"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Ensure you're using Next.js or replace with 'img' if not
import { Router } from "lucide-react";

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
  const router = useRouter();

  // New state to hold the final star rating (0-5) for each bean
  const [beanStars, setBeanStars] = useState<{ [key: number]: number }>({});

  // Define the preparation steps with images
  const preparationSteps = [
    {
      instruction:
        "Grind beans finely and prepare equal cups to the number of beans selected. Put beans into the cups.",
      imageSrc: "/images/grinding.gif",
      altText: "Grinding coffee beans",
    },
    {
      instruction: "Boil water to 100 degrees Celsius.",
      imageSrc: "/images/boiling.gif",
      altText: "Boiling water",
    },
    {
      instruction: "Mix boiled water with ground beans in the cups.",
      imageSrc: "/images/stirring.gif",
      altText: "Mixing water with ground beans",
    },
    {
      instruction:
        "Taste with a small spoon and focus on the attributes: flavor, aroma, acidity, body, and sweetness.",
      imageSrc: "/images/tastegif.gif",
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

  const handleCompleteTest = () => {
    // Ensure all ratings are provided
    if (selectedBeans.length !== 2) {
      setError("Please select exactly two beans to complete the test.");
      return;
    }
    // Proceed to results step
    // Initialize beanStars to 0 for each tested bean
    const initialStars: { [key: number]: number } = {};
    testOrder.forEach((bean) => {
      initialStars[bean.id] = 0;
    });
    setBeanStars(initialStars);
    setStep("results");
  };

  // Handle saving the bean star ratings to supabase
  const handleSaveBeanRatings = async () => {
    try {
      // Update each bean's beans_rating column
      for (const bean of testOrder) {
        const rating = beanStars[bean.id];
        const { error } = await supabase
          .from("coffeebeans")
          .update({ beans_rating: rating })
          .eq("id", bean.id);

        if (error) {
          console.error("Error updating bean rating:", error);
          setError("Failed to save your bean star ratings. Please try again.");
          return;
        }
      }

      alert("Bean star ratings saved successfully!");
      router.push("/protected/displaycommunity");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while saving your bean ratings.");
    }
  };

  const handleRestartTest = () => {
    setSelectedBeans([]);
    setTestOrder([]);
    setAttributeRatings({});
    setBeanStars({});
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
        <li>Finally, give a star rating from 0 to 5 to each bean at the end.</li>
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
          <div className="mb-6">{renderInstructions()}</div>

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
              <p className="text-lg">
                {preparationSteps[preparationStepIndex].instruction}
              </p>
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
              {preparationStepIndex < preparationSteps.length - 1
                ? "Next"
                : "Proceed to Test"}
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
              <p className="mb-4">
                Taste the coffee and adjust the sliders to reflect your
                experience.
              </p>
              <div className="space-y-4">
                {/* Flavor Slider */}
                <div>
                  <label
                    htmlFor={`flavor-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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
                      handleAttributeChange(
                        bean.id,
                        "flavor",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full mt-1"
                  />
                </div>

                {/* Aroma Slider */}
                <div>
                  <label
                    htmlFor={`aroma-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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
                      handleAttributeChange(
                        bean.id,
                        "aroma",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full mt-1"
                  />
                </div>

                {/* Acidity Slider */}
                <div>
                  <label
                    htmlFor={`acidity-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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
                      handleAttributeChange(
                        bean.id,
                        "acidity",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full mt-1"
                  />
                </div>

                {/* Body Slider */}
                <div>
                  <label
                    htmlFor={`body-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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
                      handleAttributeChange(
                        bean.id,
                        "body",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full mt-1"
                  />
                </div>

                {/* Sweetness Slider */}
                <div>
                  <label
                    htmlFor={`sweetness-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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
                      handleAttributeChange(
                        bean.id,
                        "sweetness",
                        parseInt(e.target.value)
                      )
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
          <h3 className="text-2xl font-semibold text-center mb-6">
            Test Results with Attribute Ratings
          </h3>
          {testOrder.map((bean) => (
            <div key={bean.id} className="mb-6 p-4 border rounded-md bg-gray-50">
              <h4 className="text-lg font-bold mb-2">{bean.name}</h4>
              <p className="mb-4">Roaster: {bean.roaster}</p>
              <div className="space-y-4">
                {/* Flavor (Read-only) */}
                <div>
                  <label
                    htmlFor={`flavor-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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

                {/* Aroma (Read-only) */}
                <div>
                  <label
                    htmlFor={`aroma-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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

                {/* Acidity (Read-only) */}
                <div>
                  <label
                    htmlFor={`acidity-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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

                {/* Body (Read-only) */}
                <div>
                  <label
                    htmlFor={`body-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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

                {/* Sweetness (Read-only) */}
                <div>
                  <label
                    htmlFor={`sweetness-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
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

                {/* Star Rating Input (0-5) */}
                <div>
                  <label
                    htmlFor={`star-rating-${bean.id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Star Rating (0 to 5): {beanStars[bean.id]}
                  </label>
                  <input
                    type="range"
                    id={`star-rating-${bean.id}`}
                    name={`star-rating-${bean.id}`}
                    min="0"
                    max="5"
                    value={beanStars[bean.id] || 0}
                    onChange={(e) =>
                      setBeanStars((prev) => ({
                        ...prev,
                        [bean.id]: parseInt(e.target.value),
                      }))
                    }
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={handleSaveBeanRatings}
              className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Save Ratings
            </button>
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

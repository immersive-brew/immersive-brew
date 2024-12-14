"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Recipe {
  id: string;
  name: string;
  description: string;
  steps: RecipeStep[];
}

interface RecipeStep {
  step_type: string; // Can be 'bloom', 'pour', 'wait', etc.
  description: string; // Description of the step
  weight: number | null; // Weight of the step, can be null for 'wait' type steps
  duration: number; // Duration in seconds
}

interface RecipeRandomizerProps {
  onSelect?: (recipe: Recipe) => void;
}

const supabase = createClient(); // Initialize Supabase client outside the component

const RecipeRandomizer: React.FC<RecipeRandomizerProps> = ({ onSelect }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonVisible, setButtonVisible] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("id, name, description, steps, brew_method");

        if (error) {
          throw error;
        }

        const recipes = (data || []) as Recipe[];
        setRecipes(recipes);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRandomize = () => {
    if (recipes.length > 0) {
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      setSelectedRecipe(randomRecipe);
      if (onSelect) {
        onSelect(randomRecipe);
      }
      setButtonVisible(false);
    }
  };

  const handleClose = () => {
    setSelectedRecipe(null); // Reset selected recipe
    setButtonVisible(true); // Show the "Randomize Recipe" button
  };

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (recipes.length === 0) return <p>No recipes available.</p>;

  return (
    <div className="">
      {buttonVisible && (
        <button
          onClick={handleRandomize}
          className="px-6 py-3 bg-[#a9826e] text-white font-bold text-lg rounded-lg shadow-md hover:bg-[#8a6a5c] transition-all"
        >
          Randomize Recipe
        </button>
      )}

      {selectedRecipe && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-2xl text-[#4a3f35]">
              {selectedRecipe.name}
            </h3>
            <button
              onClick={handleClose}
              className="text-sm px-4 py-2 bg-[#a9826e] text-white rounded-md shadow hover:bg-[#8a6a5c] transition-all"
            >
              Close
            </button>
          </div>
          <p className="text-gray-700 mb-6">{selectedRecipe.description}</p>
          <h4 className="text-xl font-semibold text-[#4a3f35] mb-4">
            Brewing Steps:
          </h4>
          <ol className="list-decimal ml-6 space-y-4">
            {selectedRecipe.steps.map((step, index) => (
              <li key={index} className="text-gray-700">
                <div>
                  <strong>Step Type:</strong> {step.step_type}
                </div>
                <div>
                  <strong>Description:</strong> {step.description}
                </div>
                {step.weight !== null && (
                  <div>
                    <strong>Weight:</strong> {step.weight} grams
                  </div>
                )}
                <div>
                  <strong>Duration:</strong>{" "}
                  {Math.floor(step.duration / 60)} minutes{" "}
                  {step.duration % 60} seconds
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default RecipeRandomizer;

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
  const [displayRecipe, setDisplayRecipe] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("id, name, description, steps");

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
      setDisplayRecipe(true);
    }
  };

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (recipes.length === 0) return <p>No recipes available.</p>;

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded shadow-md">
      {buttonVisible && (
        <button
          onClick={handleRandomize}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Randomize Recipe
        </button>
      )}
      {displayRecipe && selectedRecipe && (
        <div className="mt-4 mb-4 p-4 border rounded w-full bg-white">
          <h3 className="font-bold text-lg">{selectedRecipe.name}</h3>
          <p className="mb-4">{selectedRecipe.description}</p>
          <h4 className="font-bold mt-4 mb-2">Steps:</h4>
          <ol className="list-decimal ml-6">
            {selectedRecipe.steps.map((step, index) => (
              <li key={index} className="mb-4">
                <div>
                  <strong>Step Type:</strong> {step.step_type}
                </div>
                <div>
                  <strong>Description:</strong> {step.description}
                </div>
                {step.weight !== null && (
                  <div>
                    <strong>Weight:</strong> {step.weight}
                  </div>
                )}
                <div>
                  <strong>Duration:</strong> {Math.floor(step.duration / 60)} minutes {step.duration % 60} seconds
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

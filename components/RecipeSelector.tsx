// components/RecipeSelector.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Recipe {
  id: string;
  name: string;
  description: string;
  steps: RecipeStep[];
  brew_method: string;
}

interface RecipeStep {
  name: string;
  duration: number; // Duration in seconds
}

interface RecipeSelectorProps {
  onSelect?: (recipe: Recipe) => void;
}

const supabase = createClient(); // Initialize Supabase client outside the component

const RecipeSelector: React.FC<RecipeSelectorProps> = ({ onSelect }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const recipeId = e.target.value;
    setSelectedRecipeId(recipeId);
    const selectedRecipe = recipes.find((recipe) => recipe.id === recipeId);
    if (selectedRecipe && onSelect) {
      onSelect(selectedRecipe);
    }
  };

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (recipes.length === 0) return <p>No recipes available.</p>;

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="recipeSelector" className="font-semibold mb-2">
        Select a Recipe
      </label>
      <select
        id="recipeSelector"
        name="recipeId" // Ensure this name attribute is present
        value={selectedRecipeId}
        onChange={handleChange}
        className="p-2 border rounded w-80"
        required
      >
        <option value="" disabled>
          -- Choose a Recipe --
        </option>
        {recipes.map((recipe) => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.name} - {recipe.description} - Method: {recipe.brew_method}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RecipeSelector;

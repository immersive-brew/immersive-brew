// pages/protected/journal/brew/start/page.tsx

import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server"; // Server-side Supabase client
import { redirect } from "next/navigation";
import BrewTimer from "@/components/BrewTimer";

interface StartBrewProcessPageProps {
  searchParams: Record<string, string | string[]>; // Ensure searchParams is correctly typed
}

interface RecipeStep {
  weight: number | null;
  duration: number; // Duration in seconds
  step_type: string;
  description: string;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  steps: RecipeStep[];
  brew_method: string;
}

export default async function StartBrewProcessPage({
  searchParams,
}: StartBrewProcessPageProps) {
  const supabase = createClient(); // Initialize Supabase client

  // Fetch authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if user is not authenticated
  if (!user) {
    return redirect("/login");
  }

  // Parse parameters from the query
  
  const waterAmount = parseFloat(searchParams.waterAmount as string);
  const coffeeAmount = parseFloat(searchParams.coffeeAmount as string);
  const grindSetting = parseFloat(searchParams.grindSetting as string);
  const temperature = parseFloat(searchParams.temperature as string);
  const recipeId = (searchParams.recipeId as string) || "";
  console.log("params", {waterAmount , coffeeAmount, recipeId});

  
  // Validate required parameters
  if (
    !waterAmount ||
    !coffeeAmount ||
    !recipeId ||
    isNaN(waterAmount) ||
    isNaN(coffeeAmount)
  ) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="w-full">
          {/* Navigation bar */}
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
              <DeployButton />
              <AuthButton />
            </div>
          </nav>
        </div>

        <div className="max-w-4xl w-full">
          {/* Error Message */}
          <h1 className="text-4xl font-bold text-center mt-10">Invalid Brew Parameters</h1>
          <p className="text-center mt-4 text-lg">
            Missing or invalid brew parameters. Please go back and ensure all fields are filled out correctly.
          </p>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    );
  }

  // Fetch recipe details based on recipeId
  const { data: recipe, error: recipeError } = await supabase
    .from("recipes") // Use only the table row type, no need for the second type argument
    .select("id, name, description, steps, brew_method")
    .eq("id", recipeId)
    .single();

  if (recipeError || !recipe) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="w-full">
          {/* Navigation bar */}
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
              <DeployButton />
              <AuthButton />
            </div>
          </nav>
        </div>

        <div className="max-w-4xl w-full">
          {/* Error Message */}
          <h1 className="text-4xl font-bold text-center mt-10">Recipe Not Found</h1>
          <p className="text-center mt-4 text-lg">
            The selected recipe could not be found. Please select a valid recipe.
          </p>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    );
  }

  // Validate that the recipe has steps
  if (!recipe.steps || !Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="w-full">
          {/* Navigation bar */}
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
              <DeployButton />
              <AuthButton />
            </div>
          </nav>
        </div>

        <div className="max-w-4xl w-full">
          {/* Error Message */}
          <h1 className="text-4xl font-bold text-center mt-10">Invalid Recipe Steps</h1>
          <p className="text-center mt-4 text-lg">
            The selected recipe does not have valid steps. Please select a different recipe.
          </p>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    );
  }

  // Calculate the water-to-coffee ratio
  const ratio = coffeeAmount !== 0 ? (waterAmount / coffeeAmount).toFixed(2) : "-";

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      {/* Navigation bar */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <DeployButton />
          <AuthButton />
        </div>
      </nav>

      <div className="max-w-4xl w-full">
        {/* Brew Details */}
        <h1 className="text-4xl font-bold text-center mt-10">Brewing: {recipe.name}</h1>
        <p className="text-center mt-4 text-lg">{recipe.description}</p>
        <p className="text-center mt-2 text-lg">Brew Method: {recipe.brew_method}</p>
        <p className="text-center mt-2 text-lg">Water Amount: {waterAmount} ml</p>
        <p className="text-center mt-2 text-lg">Coffee Amount: {coffeeAmount} g</p>
        <p className="text-center mt-2 text-lg">Ratio: {ratio}</p>

        {/* Brew Timer */}
        <div className="mt-8">
          <BrewTimer stages={recipe.steps} recipeId={recipe.id} temperature={temperature} grindSetting={grindSetting} waterAmount={waterAmount} coffeeAmount={coffeeAmount} /> {/* Pass the dynamic stages from the recipe */}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}

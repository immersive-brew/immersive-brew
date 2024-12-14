import { createClient } from "@/utils/supabase/server";
import RatioCalculator from "@/components/RatioCalculator";
import RecipeSelector from "@/components/RecipeSelector";
import BrewingToolsSelector from "@/components/BrewingToolsSelector";
import { redirect } from "next/navigation";

interface StartBrewPageProps {
  searchParams: Record<string, string | string[]>;
}

export default async function StartBrewPage({ searchParams }: StartBrewPageProps) {
  const supabase = createClient();

  // Fetch authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mt-10">Start Your Brew</h1>
        <p className="text-center mt-4 text-lg">
          Customize your manual coffee brew and start brewing.
        </p>

        {/* Coffee Form for Manual Brewing */}
        <div className="mt-8">
          <form
            action="/protected/journal/brew/start"
            method="GET"
            className="flex flex-col gap-4 items-center"
          >
            <RecipeSelector />
            <RatioCalculator />

            {/* Brewing Tools Selector */}
            <BrewingToolsSelector />

            {/* Temperature Input */}
            <div className="flex flex-col">
              <label htmlFor="temperature" className="font-semibold">
                Temperature (°C) 
              </label>
              <label>Ideally 90°C-100°C</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                className="p-2 border rounded w-80"
                required
                min={50}
                max={100}
              />
            </div>

            {/* Grind Setting Input */}
            <div className="flex flex-col">
              <label htmlFor="grindSetting" className="font-semibold">
                Grind Setting
              </label>
              <input
                type="number"
                id="grindSetting"
                name="grindSetting"
                className="p-2 border rounded w-80"
                required
                min={1}
                max={10}
              />
            </div>

            {/* Start Button */}
            <button
              type="submit"
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Start Brewing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

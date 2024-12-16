import { createClient } from "@/utils/supabase/server";
import RatioCalculator from "@/components/RatioCalculator";
import RecipeSelector from "@/components/RecipeSelector";
import BrewingToolsSelector from "@/components/BrewingToolsSelector";
import { redirect } from "next/navigation";

interface StartBrewPageProps {
  searchParams: Record<string, string | string[]>;
}

// A helper function to generate directional hints (arrows) based on feedback.
// You can modify this logic depending on the exact wording of your feedback suggestions.
function getDirectionalHint(feedbackSuggestion: string) {
  const directions = {
    temperature: null as "up" | "down" | null,
    grind: null as "up" | "down" | null,
  };

  // Check for grind suggestions
  // "Finer grind" means smaller grind number → show a downward arrow (↓)
  if (feedbackSuggestion.toLowerCase().includes("finer grind")) {
    directions.grind = "down";
  }
  // "Coarser grind" means larger grind number → show an upward arrow (↑)
  else if (feedbackSuggestion.toLowerCase().includes("coarser grind")) {
    directions.grind = "up";
  }

  // Check for temperature suggestions
  // "Use hotter" or "increase temperature" means increase → show an upward arrow (↑)
  if (
    feedbackSuggestion.toLowerCase().includes("hotter") ||
    feedbackSuggestion.toLowerCase().includes("increase temperature")
  ) {
    directions.temperature = "up";
  }
  // "Use cooler" or "decrease temperature" means decrease → show a downward arrow (↓)
  else if (
    feedbackSuggestion.toLowerCase().includes("cooler") ||
    feedbackSuggestion.toLowerCase().includes("decrease temperature")
  ) {
    directions.temperature = "down";
  }

  return directions;
}

function renderArrow(direction: "up" | "down" | null) {
  if (direction === "up") {
    return <span className="text-green-600">↑</span>;
  } else if (direction === "down") {
    return <span className="text-red-600">↓</span>;
  }
  return null;
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

  // Fetch user's profile to get the latest feedback
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("latest_feedback")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile data:", profileError);
  }

  const latestFeedback = profileData?.latest_feedback;
  const feedbackSuggestion = latestFeedback?.feedback_suggestion || null;
  const feedbackExpectedOutput = latestFeedback?.feedback_expected_output || null;

  // Fetch the last brew from the `brews` table
  const { data: lastBrewData, error: lastBrewError } = await supabase
    .from("entries")
    .select("*")
    .eq("userid", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (lastBrewError) {
    console.error("Error fetching last brew:", lastBrewError);
  }

  const lastBrew = lastBrewData || null;

  // Determine directional hints for each parameter based on the feedback
  let directionHints = { temperature: null, grind: null };
  if (feedbackSuggestion) {
    directionHints = getDirectionalHint(feedbackSuggestion);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mt-10">Start Your Brew</h1>
        <p className="text-center mt-4 text-lg">
          Customize your manual coffee brew and start brewing.
        </p>

        {/* If there is feedback, show recommendations */}
        {feedbackSuggestion && feedbackExpectedOutput && (
          <div className="mt-8 bg-yellow-100 p-4 rounded text-center">
            <h2 className="text-2xl font-semibold mb-2">Recommended Changes from Your Last Brew</h2>
            <p>
              <strong>You should:</strong> {feedbackSuggestion}
            </p>
            <p>
              <strong>Expected Result:</strong> {feedbackExpectedOutput}
            </p>
          </div>
        )}

        {/* If last brew is available, show current and suggested directional changes */}
        {lastBrew && (
          <div className="mt-8 bg-gray-100 p-4 rounded text-center">
            <h3 className="text-xl font-semibold mb-4">Your Last Brew Parameters</h3>
            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Last Temperature:</span> {lastBrew.temperature}°C{" "}
                {renderArrow(directionHints.temperature)}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Last Grind Setting:</span> {lastBrew.grind_setting}{" "}
                {renderArrow(directionHints.grind)}
              </div>
              {/* You can add more parameters here if your table has them */}
            </div>
          </div>
        )}

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
                max={99}
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

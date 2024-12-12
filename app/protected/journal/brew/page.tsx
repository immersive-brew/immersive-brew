import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import RatioCalculator from "@/components/RatioCalculator";
import { redirect } from "next/navigation";
import RecipeSelector from "@/components/RecipeSelector";

interface StartBrewPageProps {
  searchParams: Record<string, string | string[]>;
}

interface Feedback {
  feedback_user?: string;            // e.g. 'Bitter'
  feedback_suggestion?: string;      // e.g. "Extract Less, Use More Coffee."
  feedback_expected_output?: string; // e.g. "Richer, Fruitier Cup of Coffee."
}

interface LatestBrew {
  temperature: number;
  coffee_weight: number;
  water_weight: number;
  grind_setting: number;
  overall_time: number;
  recipeid?: string;
}

// Example suggestions mapping:
// Keys match feedback_user values, and for each feedback we define how to adjust parameters.
// Adjust or add entries as needed for different feedback_user values.
const suggestedChanges: Record<string, Array<{
  param: string;
  direction: "up" | "down";
  amount: number;
  reason?: string;
}>> = {
  Bitter: [
    {
      param: "temperature",
      direction: "down",
      amount: 2,
      reason: "Lower temperature to reduce bitterness."
    },
    {
      param: "coffee_weight",
      direction: "up",
      amount: 2,
      reason: "Use slightly more coffee for balance."
    }
  ],
  Dull: [
    {
      param: "grind_setting",
      direction: "down",
      amount: 1,
      reason: "Finer grind to extract more complexity."
    }
  ],
  // Add more feedback-based suggestions here...
  // 'Pleasant' might have no changes because it's already perfect.
  Pleasant: [],
};

export default async function StartBrewPage({ searchParams }: StartBrewPageProps) {
  const supabase = createClient();

  // Fetch authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if user is not authenticated
  if (!user) {
    return redirect("/login");
  }

  // Fetch profile with latest feedback
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("latest_feedback")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  let feedback: Feedback | null = null;
  if (profile && profile.latest_feedback) {
    feedback = profile.latest_feedback;
  }

  // Fetch latest brew entry from 'entries' table
  const { data: latestBrew, error: entriesError } = await supabase
    .from("entries")
    .select("temperature, coffee_weight, water_weight, grind_setting, overall_time, recipeid")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (entriesError) {
    console.error("Error fetching latest brew:", entriesError);
  }

  // Get the applicable suggestions for the user's feedback
  const currentSuggestions = feedback?.feedback_user
    ? suggestedChanges[feedback.feedback_user] || []
    : [];

  // Helper function to display a parameter line with suggestions
  const renderParameterWithSuggestion = (
    label: string,
    value: number,
    paramKey: string
  ) => {
    const suggestion = currentSuggestions.find((s) => s.param === paramKey);

    return (
      <p className="mt-2">
        <strong>{label}:</strong> {value}
        {suggestion && (
          <span className="ml-2">
            {suggestion.direction === "up" ? (
              <span className="text-green-600 font-bold">↑ +{suggestion.amount}</span>
            ) : (
              <span className="text-red-600 font-bold">↓ -{suggestion.amount}</span>
            )}
            {suggestion.reason && (
              <span className="ml-2 text-sm text-gray-600 italic">({suggestion.reason})</span>
            )}
          </span>
        )}
      </p>
    );
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mt-10">Start Your Brew</h1>
        <p className="text-center mt-4 text-lg">
          Customize your manual coffee brew and start brewing.
        </p>

        {/* Display Latest Feedback */}
        {feedback ? (
          <div className="mt-8 bg-gray-100 p-4 rounded">
            <h2 className="text-2xl font-bold">Latest Feedback</h2>
            <p className="mt-2">
              <strong>Taste:</strong> {feedback.feedback_user || "No taste feedback provided"}
            </p>
            <p>
              <strong>Advice:</strong> {feedback.feedback_suggestion || "No advice provided"}
            </p>
            <p>
              <strong>Expected Output:</strong>{" "}
              {feedback.feedback_expected_output || "No expected output provided"}
            </p>
          </div>
        ) : (
          <p className="mt-8 text-gray-500">No feedback available yet.</p>
        )}

        {/* Display Latest Brew and Suggestions */}
        {latestBrew ? (
          <div className="mt-8 bg-gray-100 p-4 rounded">
            <h2 className="text-2xl font-bold">Latest Brew</h2>
            {renderParameterWithSuggestion("Temperature", latestBrew.temperature, "temperature")}
            {renderParameterWithSuggestion("Coffee Weight", latestBrew.coffee_weight, "coffee_weight")}
            {renderParameterWithSuggestion("Water Weight", latestBrew.water_weight, "water_weight")}
            {renderParameterWithSuggestion("Grind Setting", latestBrew.grind_setting, "grind_setting")}
            {renderParameterWithSuggestion("Overall Time", latestBrew.overall_time, "overall_time")}
          </div>
        ) : (
          <p className="mt-8 text-gray-500">No brews available yet.</p>
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
            {/* Temperature Input */}
            <div className="flex flex-col">
              <label htmlFor="temperature" className="font-semibold">
                Temperature (°C)
              </label>
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
                Grind Setting (1-10)
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

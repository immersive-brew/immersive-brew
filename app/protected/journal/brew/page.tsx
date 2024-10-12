import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import RatioCalculator from "@/components/RatioCalculator";
import { redirect } from "next/navigation";
import RecipeSelector from "@/components/RecipeSelector"; // Import the client component

interface StartBrewPageProps {
  searchParams: Record<string, string | string[]>;
}

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

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        {/* Navigation bar (Deploy and Auth buttons) */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <DeployButton />
            <AuthButton />
          </div>
        </nav>
      </div>

      <div className="max-w-4xl w-full">
        {/* Main content */}
        <h1 className="text-4xl font-bold text-center mt-10">Start Your Brew</h1>
        <p className="text-center mt-4 text-lg">
          Customize your manual coffee brew and start brewing.
        </p>

        {/* Coffee Form for Manual Brewing */}
        <div className="mt-8">
          <form
            action="/protected/journal/brew/start" // Updated action
            method="GET" // You can change to "POST" if preferred
            className="flex flex-col gap-4 items-center"
          >
            {/* Recipe Selector */}
            <RecipeSelector />

            {/* Ratio Calculator */}
            <RatioCalculator />

            {/* Temperature Input */}
            <div className="flex flex-col">
              <label htmlFor="temperature" className="font-semibold">
                Temperature (°C)
              </label>
              <input
                type="number"
                id="temperature"
                name="temperature" // Added name attribute for temperature
                className="p-2 border rounded w-80"
                required
                min={50} // Setting a reasonable minimum temperature
                max={100} // Setting a reasonable maximum temperature
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
                name="grindSetting" // Added name attribute for grind setting
                className="p-2 border rounded w-80"
                required
                min={1} // Setting a minimum grind setting
                max={10} // Setting a maximum grind setting
              />
            </div>

            {/* Start Button */}
            <button
              type="submit" // Changed to submit button
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

// BrewGuides.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CardList from "@/components/CardList"; // Import the Client Component
import RecipeRandomizer from "@/components/RecipeRandomizer";

export default async function BrewGuides() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Server side content and logic
  return (
    <div>

      <h1>Brew Guides</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus tempore...</p>

      <div className="flex justify-center my-8">
        {/* Add any other content you need here */}
      </div>

      <h2>Community Brews</h2>

      {/* Pass any necessary data to the Client Component */}
      <CardList />
      <h2>Recipe of the Day</h2>

      {/* Pass any necessary data to the Client Component */}
      <RecipeRandomizer />
    </div>
  );
}

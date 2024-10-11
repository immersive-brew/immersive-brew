// BrewGuides.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CardList from "@/components/CardList"; // Import the Client Component
import BrewGuide from "@/components/BrewGuide"; // Import BrewGuide Component

export default async function BrewGuides() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Example brew guide data (generic brewing device info)
  const exampleGuide = {
    name: "Chemex Brewer",
    description:
      "The Chemex is a popular pour-over brewing device known for producing a clean, clear, and balanced cup of coffee. You use a thick paper filter which captures a lot of oils and small particles, making the coffee taste smooth and crisp. It's ideal for a medium-coarse grind and requires careful pouring of water in a circular motion to ensure even extraction. A Chemex brew usually takes 4 minutes, producing a bright and flavorful coffee.",
    imageUrl: "/brew.png", // Correct image path based on your folder structure
    tldr: "A classic pour-over device that delivers clean, crisp coffee.",
    videoUrl: "https://www.youtube.com/embed/_44o-lCopNU?si=V_OcWJ0BXHmCbNIU", // Optional
  };

  // Server-side content and logic
  return (
    <div className="container mx-auto px-4">
      {/* Main Heading */}
      <h1 className="text-2xl font-bold mt-4">Brew Guides</h1>
      <p className="mt-2 text-gray-600">
        Learn how to use different brewing devices to perfect your cup of coffee.
      </p>

      {/* Brew Guide Example */}
      <div className="flex justify-center my-8">
        {/* Render the example brew guide */}
        <BrewGuide
          name={exampleGuide.name}
          imageUrl={exampleGuide.imageUrl}
          description={exampleGuide.description}
          tldr={exampleGuide.tldr}
          videoUrl={exampleGuide.videoUrl}
        />
      </div>

      {/* Section for Community Brews */}
      <h2 className="text-xl font-bold mt-10">Community Brews</h2>

      {/* Pass any necessary data to the Client Component */}
      <CardList />
    </div>
  );
}

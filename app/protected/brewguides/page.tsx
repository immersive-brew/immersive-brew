import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CardList from "@/components/CardList";
import BrewGuide from "@/components/BrewGuide";
import Notification from "@/components/Notification";
import CoffeeHistory from "@/components/CoffeeHistory";
import BlindTastingMenuClient from "@/components/BlindTastingMenuClient"; // Import the Client Component

export default async function BrewGuides() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Example brew guide data
  const exampleGuide = {
    name: "Chemex Brewer",
    description:
      "The Chemex is a popular pour-over brewing device known for producing a clean, clear, and balanced cup of coffee. You use a thick paper filter which captures a lot of oils and small particles, making the coffee taste smooth and crisp. It's ideal for a medium-coarse grind and requires careful pouring of water in a circular motion to ensure even extraction. A Chemex brew usually takes 4 minutes, producing a bright and flavorful coffee.",
    imageUrl: "/brew.png",
    tldr: "A classic pour-over device that delivers clean, crisp coffee.",
    videoUrl: "https://www.youtube.com/embed/_44o-lCopNU?si=V_OcWJ0BXHmCbNIU",
  };

  // Coffee types data
  const coffeeTypesData = [
    {
      name: "Americano",
      description:
        "An Americano is made by adding hot water to a shot of espresso, giving it a similar strength to drip coffee but with a different flavor profile. The result is a smooth, rich cup that’s less intense than a traditional espresso shot.",
      imageUrl: "/images/americano.png",
    },
    // Add more coffee types as needed
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Main Heading */}
      <h1 className="text-2xl font-bold mt-4">Brew Guides</h1>
      <p className="mt-2 text-gray-600">
        Learn how to use different brewing devices to perfect your cup of coffee.
      </p>

      {/* Brew Guide Example */}
      <div className="flex justify-center my-8">
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
      <Notification />
      <CardList />

      {/* Coffee Drinks Section */}
      <CoffeeHistory coffeeTypes={coffeeTypesData} />
    </div>
  );
}

// BrewGuides.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CardList from "@/components/CardList"; // Import the Client Component
import BrewGuide from "@/components/BrewGuide"; // Import BrewGuide Component
import Notification from "@/components/Notification";
import CoffeeHistory from "@/components/CoffeeHistory";
import BlindTastingMenu from "@/components/BlindTestMenu";

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
  //coffeehistory data
  const coffeeTypesData = [
    {
      name: "Americano",
      description:
        "An Americano is made by adding hot water to a shot of espresso, giving it a similar strength to drip coffee but with a different flavor profile. The result is a smooth, rich cup that’s less intense than a traditional espresso shot.",
      imageUrl: "/pictures/Americano.png", // Update with the correct image path
    },
    {
      name: "Mocha",
      description:
        "A Mocha is a chocolate-flavored variant of a latte. It’s typically made with one-third espresso, two-thirds steamed milk, and a portion of hot chocolate or cocoa. Mocha provides a sweet, indulgent option for coffee drinkers who enjoy the taste of chocolate.",
      imageUrl: "/images/mocha.png",
    },
    {
      name: "Espresso",
      description:
        "Espresso is a full-flavored, concentrated form of coffee served in small shots. It’s made by forcing pressurized hot water through finely-ground coffee beans, resulting in a bold, rich flavor that serves as the base for many other coffee drinks.",
      imageUrl: "/images/espresso.png",
    },
    {
      name: "Latte",
      description:
        "A Latte consists of one shot of espresso with steamed milk and a small amount of milk foam. The steamed milk creates a creamy texture, making the Latte one of the most popular coffee drinks globally.",
      imageUrl: "/images/latte.png",
    },
    {
      name: "Cappuccino",
      description:
        "A Cappuccino is similar to a Latte but with more foam and less steamed milk. It consists of equal parts of espresso, steamed milk, and milk foam, providing a balanced and strong coffee flavor with a creamy texture.",
      imageUrl: "/images/cappuccino.png",
    },
    {
      name: "Macchiato",
      description:
        "A Macchiato is an espresso coffee drink with a small amount of milk, usually foamed, added to it. The word 'macchiato' means 'stained' or 'spotted' in Italian, referring to the mark left by the milk in the espresso.",
      imageUrl: "/images/macchiato.png",
    },
  ];
  

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
      <Notification />
      <h2>Community Brews</h2>

      {/* Pass any necessary data to the Client Component */}
      <CardList />

      {/* Coffee Drinks Section */}
      <CoffeeHistory coffeeTypes={coffeeTypesData} />
      {/*Blind Tasting Menu */}
      
      <BlindTastingMenu />
      
    </div>
  );
}

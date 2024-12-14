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
      imageUrl: "https://www.mysticmonkcoffee.com/cdn/shop/articles/americano_coffee_1024x.png?v=1706611607",
    },
    {
      name: "Cappuccino",
      description: "A cappuccino is a coffee drink made by adding steamed milk to espresso, creating a creamy and balanced cup of coffee with a smooth texture and a rich, aromatic flavor.",
      imageUrl: "https://www.thespruceeats.com/thmb/oUxhx54zsjVWfPlrgedJU0MZ-y0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-to-make-cappuccinos-766116-hero-01-a754d567739b4ee0b209305138ecb996.jpg",
    },
    {
      name: "Latte",
      description: "A latte is a coffee drink made by adding steamed milk to espresso, creating a creamy and balanced cup of coffee with a smooth texture and a rich, aromatic flavor.",
      imageUrl: "https://www.foodandwine.com/thmb/CCe2JUHfjCQ44L0YTbCu97ukUzA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Partners-Latte-FT-BLOG0523-09569880de524fe487831d95184495cc.jpg",
    },
    {
      name: "Mocha",
      description: "A mocha is a coffee drink made by adding chocolate syrup to espresso, creating a creamy and rich cup of coffee with a smooth texture and a complex flavor profile.",
      imageUrl: "https://athome.starbucks.com/sites/default/files/styles/recipe_banner_xlarge/public/2024-05/CaffeMocha_RecipeHeader_848x539_%402x.jpg.webp?itok=ov3gQo8W",
    },
    {
      name: "Flat White",
      description: "A flat white is a coffee drink made by adding steamed milk to espresso, creating a creamy and balanced cup of coffee with a smooth texture and a rich, aromatic flavor.",
      imageUrl: "https://methodicalcoffee.com/cdn/shop/articles/Flat_white_sitting_on_a_table.jpg?v=1695740372",
    }
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

      {/* Coffee Drinks Section */}
      <CoffeeHistory coffeeTypes={coffeeTypesData} />
    </div>
  );
}

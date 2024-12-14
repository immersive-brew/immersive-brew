import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BrewGuide from "@/components/BrewGuide";
import CoffeeHistory from "@/components/CoffeeHistory";

export default async function BrewGuides() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Brew guide data
  const brewGuides = [
    {
      name: "Chemex Brewer",
      description:
        "The Chemex is a popular pour-over brewing device known for producing a clean, clear, and balanced cup of coffee. You use a thick paper filter which captures a lot of oils and small particles, making the coffee taste smooth and crisp. It's ideal for a medium-coarse grind and requires careful pouring of water in a circular motion to ensure even extraction. A Chemex brew usually takes 4 minutes, producing a bright and flavorful coffee.",
      imageUrl: "/brew.png",
      tldr: "A classic pour-over device that delivers clean, crisp coffee.",
      videoUrl: "https://www.youtube.com/embed/_44o-lCopNU?si=V_OcWJ0BXHmCbNIU",
    },
    {
      name: "Hario V60",
      description:
        "The Hario V60 is a conical pour-over brewing device that allows for precise control over water flow and extraction. Using a medium-fine grind and a spiral pattern for pouring, it produces a bright, clean, and complex cup of coffee. Ideal brewing time is around 2.5–3 minutes.",
      imageUrl: "/hario.jpg",
      tldr: "A versatile pour-over for bright and complex coffee.",
      videoUrl:"https://www.youtube.com/embed/PUufsQ-nBgQ?si=KlQj5zy63GFaC1OE",
    },
    {
      name: "Aeropress",
      description:
        "The Aeropress is a compact, versatile coffee brewing device perfect for making single servings of coffee. It uses air pressure to push water through coffee grounds, resulting in a smooth, rich, and flavorful cup. It's ideal for fine to medium grind coffee and can produce espresso-like shots or a drip-style brew. Brewing time is typically under 2 minutes.",
      imageUrl: "/aeropress.webp",
      tldr: "A compact brewer for rich and smooth coffee.",
      videoUrl: "https://www.youtube.com/embed/97VYBfxn2KI?si=Igw_3fXG3KwkdXJy",
    },
    {
      name: "French Press",
      description:
        "The French Press is a classic immersion brewing method that produces a full-bodied and rich cup of coffee. It’s easy to use: just add coarsely ground coffee, pour hot water, steep for 4 minutes, and press the plunger. This method retains more of the coffee's natural oils and flavors for a robust taste.",
      imageUrl: "/frenchpress.png",
      tldr: "A simple and classic method for full-bodied coffee.",
      videoUrl: "https://www.youtube.com/embed/2ziSri3o8Y8?si=dc-gv8sFDS3TbGyy",
    },
  ];

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

      {/* Brew Guides Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 my-8">
        {brewGuides.map((guide) => (
          <BrewGuide
            key={guide.name}
            name={guide.name}
            imageUrl={guide.imageUrl}
            description={guide.description}
            tldr={guide.tldr}
            videoUrl={guide.videoUrl}
          />
        ))}
      </div>

      {/* Coffee Drinks Section */}
      <CoffeeHistory coffeeTypes={coffeeTypesData} />
    </div>
  );
}

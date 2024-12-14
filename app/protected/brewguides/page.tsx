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

  const grindGuides = [
    {
      name: "Baratza Encore",
      description: "Baratza Encore is a full-size electric burr grinder. It's easy to use: just add beans, set to appropriate grindsetting and let it run until it stops.",
      imageUrl: "https://m.media-amazon.com/images/I/51RV+DAkEVL.jpg",
      tldr: "A compact grinder for rich and smooth coffee.",
      videoUrl: "https://www.youtube.com/embed/kRrzStroKzs?si=DXCcyL1UYGglP6eK",
    },
    {
      name: "Timemore Chestnut C2",
      description:
        "The Timemore Chestnut C2 is a compact grinder with a small footprint. This is a nice budget option for those looking for a compact grinder.",
      tldr: "A budget powerhouse.",
      videoUrl:"https://www.youtube.com/embed/I3NaBQavcWQ?si=4KOg6OdBvh-hk4XC",
    },
    {
      name: "1Zpresso J Manual",
      description:
        "The 1Zpresso J Manual is a compact device that grinds beans fine enough for use of espresso. This is a nice option for those who want a consistent grind for cheap pairing with an espresso machine.",
      imageUrl: "/aeropress.webp",
      tldr: "Espresso-ready for cheap.",
      videoUrl: "https://www.youtube.com/embed/PtcwZRfkLN0?si=RTtHy7REcH5acp9J",
    },
  ];

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

  const coffeeBeansData = [
    {
      name: "Arabica",
      description: "Arabica is a type of coffee bean that is grown in the Arabica region of Central America. It is the most common type of coffee bean in the world and is used to make coffee.",
      imageUrl: "https://www.foodandwine.com/thmb/XbKXqQvF61Csj9XLs_Nj3xwlwEI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Everything-You-Need-To-Know-About-Arabica-Coffee-FT-BLOG0822-2000-127d1551916e45138ea373de75f08138.jpg",
    },
    {
      name: "Robusta",
      description: "Robusta is a type of coffee bean that is grown in the Robusta region of Central America. It is the second most common type of coffee bean in the world and is used to make coffee.",
      imageUrl: "https://espresso-works.com/cdn/shop/articles/espresso-works-blog-coffee-101-robusta-coffee-1_1081x.jpg?v=1681280369",
    },
    {
      name: "Liberica",
      description: "Liberica is a type of coffee bean that is grown in the Liberica region of Central America. It is a rare and exotic type of coffee bean and is used to make coffee.",
      imageUrl: "https://www.siamhillscoffee.com/wp-content/uploads/What-is-Liberica-Coffee-%E2%80%93-The-Worlds-Rarest-Coffee-Type-%E2%80%93-2-1-1030x687.jpg",
    },
    {
      name: "Catharina",
      description: "Catharina is a type of coffee bean that is grown in the Catharina region of Central America. It is a rare and exotic type of coffee bean and is used to make coffee.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw6vJ7MzqfHA9WLOG_kws-RlTCb8B3v2-IGA&s",
    },
    {
      name: "Excelsa",
      description: "Excelsa is a type of coffee bean that is grown in the Excelsa region of Central America. It is a rare and exotic type of coffee bean and is used to make coffee.",
      imageUrl: "https://bakedbrewedbeautiful.com/wp-content/uploads/2020/08/DSC0258-scaled.jpg",
    }
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

      <h1 className="text-2xl font-bold mt-4">Grinder Guides</h1>
      <p className="mt-2 text-gray-600">
        Learn how to use different grinders to perfect your cup of coffee.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 my-8">
        {grindGuides.map((guide) => (
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
      <CoffeeHistory coffeeTypes={coffeeTypesData} title="Types of Coffee Drinks" />

      {/* Coffee Beans Section */}
      <CoffeeHistory coffeeTypes={coffeeBeansData} title="Types of Coffee Beans" />
    </div>
  );
}

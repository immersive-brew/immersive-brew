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
      <CoffeeHistory coffeeTypes={coffeeTypesData} title="Types of Coffee Drinks" />

      {/* Coffee Beans Section */}
      <CoffeeHistory coffeeTypes={coffeeBeansData} title="Types of Coffee Beans" />
    </div>
  );
}

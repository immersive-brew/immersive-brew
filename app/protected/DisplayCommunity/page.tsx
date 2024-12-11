// app/explore/page.tsx
import React from "react";
import CoffeeGridItem from "@/components/CoffeeGridItem";

const coffeeItems = [
  { id: 1, title: "Espresso", image: "/images/espresso.jpg" },
  { id: 2, title: "Latte", image: "/images/latte.jpg" },
  { id: 3, title: "Cappuccino", image: "/images/cappuccino.jpg" },
  { id: 4, title: "Americano", image: "/images/americano.jpg" },
  { id: 5, title: "Flat White", image: "/images/flatwhite.jpg" },
  { id: 6, title: "Macchiato", image: "/images/macchiato.jpg" },
];

const ExplorePage: React.FC = () => {
  return (
    <div className="explore-page">
      <h1 className="explore-title">Explore Coffee</h1>
      <div className="coffee-grid">
        {coffeeItems.map((item) => (
          <CoffeeGridItem key={item.id} title={item.title} image={item.image} />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;

import React from "react";


interface CoffeeGridItemProps {
  title: string;
  image: string;
}

const CoffeeGridItem: React.FC<CoffeeGridItemProps> = ({ title, image }) => {
  return (
    <div className="coffee-grid-item">
      <img src={image} alt={title} className="coffee-image" />
      <div className="coffee-title">{title}</div>
    </div>
  );
};

export default CoffeeGridItem;

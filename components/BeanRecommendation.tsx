"use client";
import React, { useState } from "react";

interface BeanRecommendationProps {
    bean: { id: number; name: string; roaster: string; roast_level: string };
}

export default function BeanRecommendation({ bean }: BeanRecommendationProps) {
    const [ratings, setRatings] = useState({
        aroma: 5,
        flavor: 5,
        acidity: 5,
        body: 5,
        sweetness: 5,
    });

    const handleSliderChange = (attribute: string, value: number) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [attribute]: value,
        }));
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-8">
            <h3 className="text-xl font-bold text-center mb-4">
                {bean.name} - {bean.roaster} ({bean.roast_level})
            </h3>
            
            {Object.keys(ratings).map((attribute) => (
                <div key={attribute} className="mb-4">
                    <label className="block font-semibold mb-2 capitalize">
                        {attribute}
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={ratings[attribute as keyof typeof ratings]}
                        onChange={(e) =>
                            handleSliderChange(attribute, Number(e.target.value))
                        }
                        className="w-full"
                    />
                    <p className="text-center mt-2">{ratings[attribute as keyof typeof ratings]}</p>
                </div>
            ))}
        </div>
    );
}

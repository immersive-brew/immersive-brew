import React, { useState } from 'react';
import { FaCoffee, FaMugHot, FaSeedling, FaWater, FaSteam, FaGlassWhiskey } from 'react-icons/fa';

interface BlindTastingMenuProps {
    onButtonClick: (label: string) => void;
}

export default function BlindTastingMenu({ onButtonClick }: BlindTastingMenuProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const buttonItems = [
        { label: "Americano", icon: <FaCoffee /> },
        { label: "Mocha", icon: <FaMugHot /> },
        { label: "Espresso", icon: <FaSeedling /> },
        { label: "Latte", icon: <FaWater /> },
        { label: "Cappuccino", icon: <FaSteam /> },
        { label: "Macchiato", icon: <FaGlassWhiskey /> },  // Substitute for FaMugMarshmallow
    ];

    return (
        <div className="bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-300 shadow-2xl rounded-3xl p-12 max-w-4xl mx-auto transform transition duration-500 hover:scale-105 ease-in-out">
            <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-wider">Blind Tasting Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {buttonItems.map(({ label, icon }, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setSelected(label);
                            onButtonClick(label);
                        }}
                        className={`${
                            selected === label ? "bg-[#8A6647] text-yellow-100" : "bg-[#B6885C] text-white"
                        } flex items-center justify-center gap-3 font-bold py-4 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-110`}
                    >
                        {icon}
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

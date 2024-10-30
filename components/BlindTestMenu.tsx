import React from 'react';

// Interface to define the structure of props that the BlindTastingMenu component expects
interface BlindTastingMenuProps {
    onButtonClick: (label: string) => void;  // Function to handle button click events
}

// The functional component that displays the Blind Tasting Menu with 6 buttons
export default function BlindTastingMenu({
    onButtonClick,
}: BlindTastingMenuProps) {

    // Button labels for the 6 tasting buttons
    const buttonLabels = ["Taste 1", "Taste 2", "Taste 3", "Taste 4", "Taste 5", "Taste 6"];

    return (
        // Main container for the BlindTastingMenu, styled with Tailwind CSS
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
            
            {/* Heading for the Blind Tasting Menu */}
            <h2 className="text-2xl font-semibold text-center mb-6">Blind Tasting Menu</h2>

            {/* Flex container to layout the buttons in two rows */}
            <div className="grid grid-cols-3 gap-4">
                {buttonLabels.map((label, index) => (
                    <button
                        key={index}
                        onClick={() => onButtonClick(label)} // Calls the function with the label as argument
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition"
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

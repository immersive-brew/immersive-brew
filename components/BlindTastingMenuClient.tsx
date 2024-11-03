"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface CoffeeBean {
    id: number;
    name: string;
    roaster: string;
    roast_level: string;
}

export default function BlindTastingMenuClient() {
    const [beans, setBeans] = useState<CoffeeBean[]>([]);
    const [selectedBeans, setSelectedBeans] = useState<number[]>([]);
    const router = useRouter();

    // Initialize Supabase client
    const supabase = createClient();

    // Fetch coffee beans from Supabase
    useEffect(() => {
        const fetchBeans = async () => {
            const { data, error } = await supabase
                .from("coffeebeans")
                .select("id, name, roaster, roast_level");
            
            if (error) {
                console.error("Error fetching beans:", error);
            } else {
                setBeans(data);
            }
        };

        fetchBeans();
    }, [supabase]);

    // Handle checkbox changes
    const handleCheckboxChange = (beanId: number) => {
        setSelectedBeans((prev) =>
            prev.includes(beanId)
                ? prev.filter((id) => id !== beanId)
                : [...prev, beanId]
        );
    };

    // Check if "Start" button should be enabled
    const isStartEnabled = selectedBeans.length >= 2;

    // Handle "Start" button click
    const handleStartClick = () => {
        if (isStartEnabled) {
            // Convert selected bean IDs to a query string
            const query = selectedBeans.map((id) => `beanIds=${id}`).join("&");
            router.push(`/protected/blindtest?${query}`);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-10">
            <h2 className="text-3xl font-bold text-center mb-6">Coffee Beans</h2>
            <p className="text-center mb-4">Select Beans (at least 2)</p>

            <div className="space-y-3">
                {beans.map((bean) => (
                    <label key={bean.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedBeans.includes(bean.id)}
                            onChange={() => handleCheckboxChange(bean.id)}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span className="text-lg">
                            {bean.name} - {bean.roaster} ({bean.roast_level})
                        </span>
                    </label>
                ))}
            </div>

            <button
                onClick={handleStartClick}
                disabled={!isStartEnabled}
                className={`w-full mt-6 py-2 text-white font-semibold rounded-lg ${
                    isStartEnabled ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
                } transition`}
            >
                Start
            </button>
        </div>
    );
}

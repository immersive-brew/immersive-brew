'use cilent';

import { useState, useEffect } from "react";
import AuthButton from "@/components/AuthButton";
import { createClient } from '@/utils/supabase/client';
import HeaderBar from "@/components/HeaderBar";
const supabase = createClient();

export default function CompareEntries() {
    const [entries, setEntries] = useState<any[]>([]);
    const [comparison, setComparison] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEntries() {
            const { data: fetchedEntries, error } = await supabase
                .from('entries')
                .select('id, created_at, temperature, coffee_weight, water_weight, grind_setting, overall_time');

            if (error) {
                console.error('Error fetching journal entries:', error);
            } else {
                setEntries(fetchedEntries || []);
            }
        }

        fetchEntries();
    }, []);

    // Comparison logic
    useEffect(() => {
        if (entries.length > 1) {
            const firstEntry = entries[0];
            const lastEntry = entries[entries.length - 1];

            const compareValues = (key: string) => {
                const firstValue = firstEntry[key];
                const lastValue = lastEntry[key];
                if (firstValue === lastValue) {
                    return `${key}: No change`;
                }
                return `${key}: Changed from ${firstValue} to ${lastValue}`;
            };

            const comparisonResults = `
                ${compareValues('temperature')}\n
                ${compareValues('coffee_weight')}\n
                ${compareValues('water_weight')}\n
                ${compareValues('grind_setting')}\n
                ${compareValues('overall_time')}
            `;

            setComparison(comparisonResults);
        }
    }, [entries]);

    return (
        <>
            <HeaderBar />
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                    <AuthButton />
                </div>
            </nav>
            <div className="p-4 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Compare Coffee Journal Entries</h1>
                {entries.length > 0 ? (
                    <div>
                        <h2 className="text-lg font-semibold">Comparison of First and Last Entries</h2>
                        <pre className="bg-gray-100 p-4 rounded-md">
                            {comparison}
                        </pre>
                    </div>
                ) : (
                    <div>No entries to compare.</div>
                )}
            </div>
        </>
    );
}

// Journal.tsx (Server Component)
import AuthButton from "@/components/AuthButton";
import JournalEntry from "@/components/JournalEntry";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function Journal() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch only the specified columns from Supabase
    const { data: entries, error } = await supabase
        .from('entries')
        .select('id, created_at, temperature, coffee_weight, water_weight, grind_setting, overall_time');

    if (error) {
        console.error('Error fetching journal entries:', error);
        return <div>Error loading entries.</div>; // Display an error message
    }

    if (!entries || entries.length === 0) {
        return (
            <>
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                        <AuthButton />
                    </div>
                </nav>

                <div className="p-4 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Coffee Journal</h1>
                    <div>No entries found.</div>
                </div>
            </>
        );
    }

    return (
        <>
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                    <AuthButton />
                </div>
            </nav>

            <JournalEntry entries={entries} />
        </>
    );
}

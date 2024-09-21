
import { createClient } from '@/utils/supabase/server';
import HelpThreadClient from '@/components/HelpThreadClient'; // Import the client-side component
import HeaderBar from "@/components/HeaderBar";
import AuthButton from "@/components/AuthButton";

// Fetching data from Supabase happens server-side in this async function
export default async function HelpThreadPage() {
    const supabase = createClient();

    // Fetch existing help threads from Supabase
    const { data: threads, error } = await supabase
        .from('threads')
        .select('id, contents, replys, created_at'); // Ensure the correct table and columns are fetched

    // If there's an error fetching threads, log it and display an error message
    if (error) {
        console.error('Error fetching threads:', error);
        return <div>Error loading help threads. Please try again later.</div>;
    }

    return (
        <>
            {/* HeaderBar and AuthButton components */}
            <HeaderBar />
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                    <AuthButton />
                </div>
            </nav>

            {/* Pass the fetched threads to the client-side component */}
            <HelpThreadClient initialThreads={threads || []} />
        </>
    );
}

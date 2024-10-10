import AuthButton from "@/components/AuthButton";
import JournalEntry from "@/components/JournalEntry";
import { createClient } from '@/utils/supabase/server';

export default async function JournalPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if user is not authenticated
  if (!user) {
    return (
      <div>
        <p>Please log in to view your journal entries.</p>
        <AuthButton />
      </div>
    );
  }

  return (
    <div>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>
      <JournalEntry /> {/* Load the JournalEntry component */}
    </div>
  );
}

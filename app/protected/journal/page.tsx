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
      <JournalEntry /> {/* Load the JournalEntry component */}
    </div>
  );
}

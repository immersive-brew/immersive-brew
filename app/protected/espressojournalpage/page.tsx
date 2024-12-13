
import { createClient } from '@/utils/supabase/server';

import AuthButton from '@/components/AuthButton';
import ExpressoJournalClient from '@/components/ExpressoJournalClient';
import { redirect } from 'next/navigation';

export default async function ExpressoJournalPage() {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/login");
  }
  
  return (
    <div className="min-h-screen text-[#4A2C2A]">
     
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="w-1/3"></div>
          <h1 className="text-3xl font-bold text-center w-1/3">Espresso Journal</h1>
        </div>
        <ExpressoJournalClient userid={user.id} />
      </main>
    </div>
  );
}
// Import necessary dependencies and components
import { createClient } from '@/utils/supabase/server'; // Import Supabase client for server-side operations
import HeaderBar from '@/components/HeaderBar'; // Import HeaderBar component for page header
import AuthButton from '@/components/AuthButton'; // Import AuthButton component for authentication actions
import ExpressoJournalClient from '@/components/ExpressoJournalClient'; // Import client-side Espresso Journal component
import { redirect } from 'next/navigation'; // Import redirect function from Next.js for navigation

// Define the main ExpressoJournalPage component as an async function
// This allows us to use await for asynchronous operations directly in the component
export default async function ExpressoJournalPage() {
  // Create a Supabase client instance for server-side data fetching
  const supabase = createClient();
  
  // Fetch the currently authenticated user
  // Using object destructuring to extract the user data from the response
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  // If no user is authenticated, redirect to the login page
  // This ensures that only authenticated users can access the Espresso Journal
  if (!user) {
    return redirect("/login");
  }
  
  // If user is authenticated, render the Espresso Journal page
  return (
    // Outer container for the entire page, using Tailwind CSS for styling
    <div className="w-full flex flex-col items-center">
      {/* Render the HeaderBar component at the top of the page */}
      <HeaderBar />
      
      {/* Render the AuthButton component for user authentication actions */}
      <AuthButton />
      
      {/* Render the client-side ExpressoJournalClient component */}
      {/* Pass the user's ID as a prop to the client component */}
      {/* This allows the client component to use the user's ID for operations like saving journal entries */}
      <ExpressoJournalClient userId={user.id} />
    </div>
  );
}
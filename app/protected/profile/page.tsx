import { createClient } from "@/utils/supabase/server"; // Server-side client creation
import ProfileForm from "@/components/ProfileForm";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import { redirect } from 'next/navigation';
import CoffeeIntake from "@/components/CoffeeIntake";
import Notification from "@/components/Notification";


export default async function Page() {
  const supabase = createClient();

  // Fetch the user and profile data on the server side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .single();

    profile = data;
  } else {
    // Optionally redirect if no user is logged in
    redirect("/login");
  }

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Your current name: <span className="font-bold">{profile?.full_name}</span>
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Would you like to change your name?
      </p>
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Your current name: <span className="font-bold">{profile?.full_name}</span>
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Would you like to change your name?
      </p>

      {/* Profile Form */}
      <div className="flex flex-col items-center">
        <ProfileForm profile={profile} />
      </div>

      {/* Delete Account Section */}
      <div className="flex flex-col items-center mt-6">
        <DeleteAccountButton />
      </div>
      <div className="flex flex-col items-center mt-6">
        <CoffeeIntake />
      </div>
      <div className="flex flex-col items-center mt-6">
        <Notification />
      </div>

    </div>
  );
}

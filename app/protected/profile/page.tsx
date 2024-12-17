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
    redirect("/login");
  }

  return (
    <div className="flex flex-col bg-[#ffe6cc] shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center text-[#4a3f35]">
        Your current name: <span className="font-bold">{profile?.full_name}</span>
      </h2>
      <p className="text-center text-[#6a5442] mb-6">
        Would you like to change your name?
      </p>

      {/* Profile Form */}
      <div className="flex flex-col items-center">
        <ProfileForm />
      </div>

      {/* Delete Account Section */}
      <div className="flex flex-col items-center mt-6">
        <DeleteAccountButton
          className="px-4 py-2 rounded bg-[#d9534f] text-white font-semibold hover:bg-[#c9302c] transition-colors shadow-md"
        />
      </div>

      {/* Other Sections */}
      <div className="flex flex-col items-center mt-6">
        <CoffeeIntake
          className="px-4 py-2 rounded bg-[#a9826e] text-white font-semibold hover:bg-[#8a6a5c] transition-colors shadow-md"
        />
      </div>
      <div className="flex flex-col items-center mt-6">
        <Notification
          className="px-4 py-2 rounded bg-[#a9826e] text-white font-semibold hover:bg-[#8a6a5c] transition-colors shadow-md"
        />
      </div>
    </div>
  );
}

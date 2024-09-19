import { createClient } from "@/utils/supabase/server"; // Server-side client creation
import HeaderBar from "@/components/HeaderBar";
import ProfileForm from "@/components/ProfileForm";
import DeleteAccountButton from "@/components/DeleteAccountButton";

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
    <div>
      <HeaderBar />
      <div>
        <h2>Your current name: {profile?.full_name}</h2>
        <p>Would you like to change your name?</p>
        {/* Pass the profile data to the ProfileForm client component */}
        <ProfileForm profile={profile} />
        <DeleteAccountButton />
      </div>
    </div>
  );
}

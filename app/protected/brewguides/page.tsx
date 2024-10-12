// BrewGuides.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CardList from "@/components/CardList"; // Import the Client Component
import HeaderBar from "@/components/HeaderBar"; // Import HeaderBar
import Notification from "@/components/Notification";
export default async function BrewGuides() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Server side content and logic
  return (
    <div>
      {/* Add the HeaderBar at the top */}
      <HeaderBar />
      
      <h1>Brew Guides</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus tempore...</p>

      <div className="flex justify-center my-8">
        {/* Add any other content you need here */}
      </div>

      <h2>Community Brews</h2>

      {/* Pass any necessary data to the Client Component */}
      <CardList />
      <div className="flex flex-col items-center mt-6">
          <Notification />
      </div>
    </div>
  );
}

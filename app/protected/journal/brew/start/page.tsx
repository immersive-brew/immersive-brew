import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BrewTimer from "@/components/BrewTimer"; // Import the client-side BrewTimer component

interface StartBrewPageProps {
  searchParams: Record<string, string | string[]>;
}

export default async function StartBrewPage({ searchParams }: StartBrewPageProps) {
  const supabase = createClient();

  // Fetch authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if user is not authenticated
  if (!user) {
    return redirect("/login");
  }

  // Parse water and coffee from the query params if they exist
  const waterAmount = parseFloat(searchParams.waterAmount as string) || "";
  const coffeeAmount = parseFloat(searchParams.coffeeAmount as string) || "";

  // Calculate the water-to-coffee ratio (if both values are provided)
  let ratio = "-";
  if (waterAmount && coffeeAmount && coffeeAmount !== 0) {
    ratio = (waterAmount / coffeeAmount).toFixed(2);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        {/* Navigation bar */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <DeployButton />
            <AuthButton />
          </div>
        </nav>
      </div>

      <div className="max-w-4xl w-full">
        {/* Brew Timer */}
        <BrewTimer /> {/* This handles the timer functionality */}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}

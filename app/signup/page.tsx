import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Signup({ searchParams }: { searchParams: { message: string } }) {
  const signUp = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const full_name = formData.get("full_name") as string;
    const token = formData.get("cf-turnstile-response") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken: token,
        data: {
          full_name: full_name,
        },
      },
    });

    if (error) {
      return redirect("/signup?message=Could not authenticate user");
    }

    return redirect("/protected");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#ebd7c7] relative">
      {/* Top coffee cup logo */}
      <div className="absolute top-8 flex justify-center w-full">
        <img src="/coffee-cup-icon.png" alt="Coffee cup logo" className="h-16" />
      </div>
      
      {/* Main form container */}
      <div className="w-full max-w-md p-8 bg-[#dec2a6] rounded-md shadow-lg">
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline bg-transparent flex items-center group text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>

        {/* Form */}
        <form className="flex flex-col w-full justify-center gap-4" action={signUp}>
          <label className="text-md" htmlFor="full_name">
            Username
          </label>
          <input
            className="rounded-md px-4 py-2 border mb-4 bg-white shadow"
            name="full_name"
            placeholder="Username"
            required
          />
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 border mb-4 bg-white shadow"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 border mb-4 bg-white shadow"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <label className="text-md" htmlFor="repassword">
            Re-enter Password
          </label>
          <input
            className="rounded-md px-4 py-2 border mb-6 bg-white shadow"
            type="password"
            name="repassword"
            placeholder="••••••••"
            required
          />
          <SubmitButton
            formAction={signUp}
            className="rounded-md px-4 py-2 bg-gray-600 text-white hover:bg-gray-400 mb-2"
            pendingText="Signing Up..."
          >
            Sign Up
          </SubmitButton>
          <div className="flex justify-center">
            <Turnstile siteKey={process.env.CLOUDFLARE_TURNSTILE_SITE_KEY || ""} />
          </div>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-gray-200 text-center">
              {searchParams.message}
            </p>
          )}
        </form>

        {/* Footer text */}
        <p className="mt-4 text-xs text-center">
          By signing up, you agree to our <span className="underline">Terms</span>, <span className="underline">Data Policy</span> and <span className="underline">Cookie Policy</span>.
        </p>
      </div>

      {/* Bottom coffee beans decoration */}
      <div className="absolute bottom-8 left-4">
        <img src="/coffee-beans-icon.png" alt="Coffee beans" className="h-12" />
      </div>
    </div>
  );
}

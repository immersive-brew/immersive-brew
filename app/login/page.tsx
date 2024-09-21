import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { TextLink } from "@/components/text-link";
import { Turnstile } from "@marsidev/react-turnstile"; // use turnstile for human authentication

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  const signIn = async (formData: FormData) => { // function to get user information from DB
    "use server"; 

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const token = formData.get("cf-turnstile-response") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: token,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user"); // error message if user information is not correct or turnstile doesn't authenticate
    }

    return redirect("/protected");
  };

  return (
    <div className="flex items-center justify-center h-screen"> 
      <div className="w-full px-8 sm:max-w-md">
        {/* Temporary container */}
      <div className="w-full max-w-md p-8 bg-[#dec2a6] rounded-md shadow-lg">
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
        >{/* Temporary CSS  */}
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

        <form className="flex flex-col w-full justify-center gap-4" action={signIn}>
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <div className="flex justify-center">
            <Turnstile siteKey={process.env.CLOUDFLARE_TURNSTILE_SITE_KEY || ""} />
          </div>
          <SubmitButton
            formAction={signIn}
            className="rounded-md px-4 py-2 bg-gray-600 text-white hover:bg-gray-400 mb-2"
            pendingText="Signing In..."
          >
            Sign In
          </SubmitButton>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-gray-200 text-center">
              {searchParams.message}
            </p>
          )}
          <label className="text-md text-center">
            Need an account? <TextLink href="/signup">Sign Up</TextLink>
          </label>
        </form>
        </div>
      </div>
    </div>
  );
}

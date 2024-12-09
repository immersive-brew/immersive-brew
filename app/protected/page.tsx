import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import RecipeRandomizer from "@/components/RecipeRandomizer";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center gap-10">
      {/* Customizable Banner with CSS Animations */}
      <div
        className="relative w-full h-[300px] bg-cover bg-center flex items-center justify-center text-white fade-in"
        style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-4 rounded-md text-slide-up">
          <h1 className="text-4xl font-bold">Welcome to Our Recipe Platform!</h1>
          <p className="mt-2 text-lg">Discover daily recipes and much more.</p>
        </div>
      </div>

      {/* Recipe of the Day Section */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold">Recipe of the Day</h2>
        <RecipeRandomizer />
      </div>

      {/* Features Summary Grid with Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg shadow-md text-center fade-in stagger-${index + 1}`}
          >
            <h3 className="font-bold text-xl">Feature {index + 1}</h3>
            <p className="mt-2 text-sm text-gray-600">Short description of Feature {index + 1}.</p>
          </div>
        ))}
      </div>

      {/* Glowing Button with Hover Effect */}
      <div className="mt-6">
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg glowing-button">
          Go to Features Page
        </button>
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
            Immersive Brew w/ Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}

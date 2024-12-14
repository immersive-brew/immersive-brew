import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RecipeRandomizer from "@/components/RecipeRandomizer";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#ffe6cc] text-[#4a3f35]">
      {/* Hero Section */}
      <header
        className=""
        style={{
          backgroundImage: "url('/path-to-your-image.jpg')",
        }}
      >
        <div className="p-6 rounded-md text-center">
          <h1 className="text-5xl font-extrabold">Welcome to Immersive Brew</h1>
          <p className="mt-4 text-lg font-medium">
            Discover guides and elevate your coffee experience.
          </p>
          <a
            href="/protected/brewguides"
            className="mt-6 px-6 py-3 rounded-lg bg-[#a9826e] text-white font-bold text-lg shadow-lg hover:bg-[#8a6a5c] transition-colors inline-block"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Recipe of the Day Section */}
      <section id="recipes" className="flex flex-col items-center py-16 px-8">
        <h2 className="text-3xl font-bold mb-6">Recipe of the Day</h2>
        <RecipeRandomizer />
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Journal Feature */}
            <div className="p-6 bg-white shadow-md rounded-lg text-center hover:shadow-lg transition-shadow">
              <img
                src="/journal.webp"
                alt="Journal feature"
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-4">Journal</h3>
              <p className="text-gray-600">
                Log your coffee journey to keep track of progress, refine your
                tastes, and improve your brewing skills over time.
              </p>
            </div>

            {/* Brew Guides Feature */}
            <div className="p-6 bg-white shadow-md rounded-lg text-center hover:shadow-lg transition-shadow">
              <img
                src="/brew.webp"
                alt="Brew guides feature"
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-4">Brew Guides</h3>
              <p className="text-gray-600">
                Beginner-friendly guides on using different brews like Chemex,
                Hario V60, Aeropress, and French Press. Perfect your technique
                and enjoy better coffee.
              </p>
            </div>

            {/* Community Feature */}
            <div className="p-6 bg-white shadow-md rounded-lg text-center hover:shadow-lg transition-shadow">
              <img
                src="/community.webp"
                alt="Community feature"
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-4">Community</h3>
              <p className="text-gray-600">
                Share your coffee entries with the community and participate in
                blind tastings. Receive constructive feedback to improve while
                fostering positive connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section
        id="cta"
        className="py-16 px-8 bg-gradient-to-r from-[#ffe6cc] to-[#f5e6d3]"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <a
            href="/protected/journal/brew"
            className="mt-6 px-6 py-3 rounded-lg bg-[#a9826e] text-white font-bold text-lg shadow-lg hover:bg-[#8a6a5c] transition-colors inline-block"
          >
            Start Brewing
          </a>
        </div>
      </section>
    </div>
  );
}

import RecipeRandomizer from "@/components/RecipeRandomizer";
import LoginRedirectButton from "@/components/LoginRedirectButton";

export default function PublicPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ffe6cc] text-[#4a3f35]">
      {/* Hero Section */}
      <header
        style={{
          backgroundImage: "url('/path-to-your-image.jpg')",
        }}
      >
        <div className="p-6 rounded-md text-center">
          <h1 className="text-5xl font-extrabold">Welcome to Immersive Brew</h1>
          <p className="mt-4 text-lg font-medium">
            Discover guides and elevate your coffee experience.
          </p>
          <LoginRedirectButton className="mt-6 px-6 py-3 rounded-lg bg-[#a9826e] text-white font-bold text-lg shadow-lg hover:bg-[#8a6a5c] transition-colors inline-block">
            Get Started
          </LoginRedirectButton>
        </div>
      </header>

      {/* Recipe of the Day Section */}
      <section id="recipes" className="flex flex-col items-center py-16 px-8">
        <h2 className="text-3xl font-bold mb-6">Recipe of the Day</h2>
        {/* Disable RecipeRandomizer */}
        <div
          className="opacity-50 pointer-events-none"
          title="Login to access this feature"
        >
          <RecipeRandomizer />
        </div>
        <LoginRedirectButton className="mt-4 px-4 py-2 rounded bg-[#a9826e] text-white font-bold shadow hover:bg-[#8a6a5c] transition">
          Login to View
        </LoginRedirectButton>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                title: "Journal",
                description:
                  "Log your coffee journey to keep track of progress, refine your tastes, and improve your brewing skills over time.",
                image: "/journal.webp",
              },
              {
                title: "Brew Guides",
                description:
                  "Beginner-friendly guides on using different brews like Chemex, Hario V60, Aeropress, and French Press. Perfect your technique and enjoy better coffee.",
                image: "/brew.webp",
              },
              {
                title: "Community",
                description:
                  "Share your coffee entries with the community and participate in blind tastings. Receive constructive feedback to improve while fostering positive connections.",
                image: "/community.webp",
              },
            ].map((feature, index) => (
              <LoginRedirectButton
                key={index}
                className="p-6 bg-white shadow-md rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <img
                  src={feature.image}
                  alt={`${feature.title} feature`}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </LoginRedirectButton>
            ))}
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
          <LoginRedirectButton className="mt-6 px-6 py-3 rounded-lg bg-[#a9826e] text-white font-bold text-lg shadow-lg hover:bg-[#8a6a5c] transition-colors inline-block">
            Start Brewing
          </LoginRedirectButton>
        </div>
      </section>
    </div>
  );
}

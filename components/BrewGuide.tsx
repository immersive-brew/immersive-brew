// components/BrewGuide.tsx

interface BrewGuideProps {
    name: string;
    imageUrl: string;
    description: string;
    tldr: string;
    videoUrl?: string; // Optional video
  }
  
  export default function BrewGuide({
    name,
    imageUrl,
    description,
    tldr,
    videoUrl,
  }: BrewGuideProps) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl">
        <div className="flex">
          {/* Left Column: Image */}
          <img
            src={imageUrl}
            alt={`${name} brewing device`}
            className="w-1/3 rounded-md object-cover"
          />
          <div className="flex-grow ml-6">
            {/* Title and TL;DR */}
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-sm text-gray-600 mt-2 italic">{tldr}</p>
          </div>
        </div>
  
        {/* Description */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">How to Use:</h3>
          <p>{description}</p>
        </div>
  
        {/* Video if available */}
        {videoUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Watch How to Use this Device:</h3>
            <div className="relative h-0 overflow-hidden max-w-full w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={videoUrl}
                title={name}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    );
  }
  
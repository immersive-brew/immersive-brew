// components/BrewGuide.tsx

// Interface to define the structure of props that the BrewGuide component expects
interface BrewGuideProps {
    name: string;       // The name of the brewing method/device
    imageUrl: string;   // The URL of the image associated with the brew
    description: string;// The detailed description of how to use the brew
    tldr: string;       // A brief summary of the brewing guide
    videoUrl?: string;  // An optional URL for a video demonstrating the brew guide
}

// The functional component that displays a brew guide
export default function BrewGuide({
    name,
    imageUrl,
    description,
    tldr,
    videoUrl,
}: BrewGuideProps) {

    return (
        // Main container for the BrewGuide, styled with Tailwind CSS
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl">
            
            {/* Flex container to layout the image and brew information side by side */}
            <div className="flex">
                
                {/* Left column: Image section */}
                <img
                    src={imageUrl} // The image URL provided via props
                    alt={`${name} brewing device`} // Alt text describing the image dynamically based on the name
                    className="w-1/3 rounded-md object-cover" // Tailwind styling for image width and appearance
                />
                
                {/* Right column: Brew name and TL;DR section */}
                <div className="flex-grow ml-6">
                    {/* The name/title of the brew guide */}
                    <h2 className="text-2xl font-semibold">{name}</h2>
                    
                    {/* The TL;DR section, styled to be smaller and italic */}
                    <p className="text-sm text-gray-600 mt-2 italic">{tldr}</p>
                </div>
            </div>

            {/* Description section */}
            <div className="mt-6">
                {/* Heading for the "How to Use" section */}
                <h3 className="text-lg font-semibold">How to Use:</h3>
                
                {/* The description of how to use the brewing method/device */}
                <p>{description}</p>
            </div>

            {/* Conditionally render the video section only if a video URL is provided */}
            {videoUrl && (
                <div className="mt-6">
                    {/* Heading for the video section */}
                    <h3 className="text-lg font-semibold">Watch How to Use this Device:</h3>
                    
                    {/* Wrapper div to ensure the video maintains a 16:9 aspect ratio */}
                    <div className="relative h-0 overflow-hidden max-w-full w-full" style={{ paddingBottom: '56.25%' }}>
                        
                        {/* The embedded YouTube (or other) video */}
                        <iframe
                            className="absolute top-0 left-0 w-full h-full" // Ensures the iframe takes up the full space of the wrapper
                            src={videoUrl} // The video URL provided via props
                            title={name} // The video title dynamically based on the name
                            frameBorder="0"
                            allowFullScreen // Allows the video to be fullscreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
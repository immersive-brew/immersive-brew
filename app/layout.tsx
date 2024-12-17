import { Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from '@/components/NavBar';
import CoffeeAnimation from '@/components/CoffeePourAnimation';
import Link from 'next/link';
import AuthButton from '@/components/AuthButton';
import ChatBot from '@/components/ChatBot';
import { headers } from 'next/headers';


const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'ImmersiveBrew - Your Personal Coffee Journey',
    description: 'Discover and perfect your coffee brewing experience with ImmersiveBrew',
    keywords: ['coffee', 'brewing', 'coffee journal', 'brew guides', 'coffee recipes'],
    authors: [{ name: 'ImmersiveBrew Team' }],
    openGraph: {
        title: 'ImmersiveBrew - Your Personal Coffee Journey',
        description: 'Discover and perfect your coffee brewing experience',
        type: 'website',
        url: defaultUrl,
    },
};

const CoffeeLogo = () => (
    <svg
        width="50"
        height="50"
        viewBox="0 0 1024 1024"
        className="text-[#2c1010] transition-transform group-hover:scale-110"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Coffee Cup */}
        <path
            d="M800 832H224c-35.346 0-64-28.654-64-64V416c0-35.346 28.654-64 64-64h576c35.346 0 64 28.654 64 64v352c0 35.346-28.654 64-64 64z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="20"
            strokeLinejoin="round"
        />
        {/* Handle */}
        <path
            d="M800 512c0 88.366-71.634 160-160 160"
            stroke="currentColor"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
        />
        {/* Steam Lines */}
        <path
            d="M300 200c0-40 40-40 40 0s-40 40-40 0"
            stroke="currentColor"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
        />
        <path
            d="M400 150c0-40 40-40 40 0s-40 40-40 0"
            stroke="currentColor"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
        />
        <path
            d="M500 200c0-40 40-40 40 0s-40 40-40 0"
            stroke="currentColor"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
        />
    </svg>
);

export const runtime = 'edge';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentHeaders = await headers(); // Await headers
    const referer = currentHeaders.get('referer') || '';
    const pathname = referer ? new URL(referer).pathname : '/';

    const hideNavbarPaths = [
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/error',
        '/maintenance'
    ];

    const shouldHideNavbar = hideNavbarPaths.some(path =>
        pathname.startsWith(path) || pathname === path
    );

    return (
        <html lang="en" className="h-full scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
            </head>
            <body
                suppressHydrationWarning={true}
                className={`
                    min-h-full 
                    flex 
                    flex-col 
                    ${poppins.className}
                    ${shouldHideNavbar ? '' : 'pt-48'}
                `}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {!shouldHideNavbar && (
                        <>
                            <div className="fixed top-6 left-0 w-full z-50">
                                <div className="bg-transparent h-24 px-8 pt-4">
                                    <div className="flex items-start">
                                        <Link href="/protected" className="flex items-center group relative">
                                            <div className="bg-[#FFF5E6] p-2 border-2 border-[#2c1010] rounded-lg flex items-center space-x-3">
                                                <div className="relative flex-shrink-0">
                                                    <CoffeeLogo />
                                                </div>
                                                <span className="text-4xl text-[#2c1010] transition-all duration-300 group-hover:text-[#3d1a1a]" style={{ fontFamily: "'Pacifico', cursive" }}>
                                                    ImmersiveBrew
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div className="w-full flex justify-between items-center px-8 py-4">
                                    <div className="flex-1 flex justify-center">
                                        <Navbar />
                                    </div>
                                    <div className="transform scale-75">
                                        <AuthButton />
                                    </div>
                                </div>
                            </div>

                            <CoffeeAnimation />
                        </>
                    )}

                    <main className="flex-1 w-full mx-auto">
                        <div className="max-w-7xl mx-auto px-4">
                            {children}
                            <ChatBot />
                        </div>
                    </main>

                    {!shouldHideNavbar && (
                        <footer className="bg-[#2c1010] text-white py-6 mt-8 text-center">
                            <div className="max-w-7xl mx-auto px-4">
                                <p className="text-sm">© 2024 ImmersiveBrew. All rights reserved.</p>
                                <p className="text-xs mt-2">
                                    Crafted with care and a passion for coffee ☕
                                </p>
                            </div>
                        </footer>
                    )}

                    <div
                        id="toast-container"
                        className="fixed top-4 right-4 z-50 space-y-2"
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}

import { Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from '@/components/NavBar';
import ChatBot from '@/components/ChatBot';
import { headers } from 'next/headers'; // Import headers to get the current URL path


const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000/';

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'ImmersiveBrew',
    description: 'ImmersiveBrew',
};

export const runtime = 'edge';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get the current URL path from headers
    const currentHeaders = headers();
    
    // Extract the 'referer' header and create a URL object to extract the pathname
    const referer = currentHeaders.get('referer') || '';
    const pathname = referer ? new URL(referer).pathname : '/';

    // Log the pathname to debug
    console.log('Extracted Pathname:', pathname);

    // Define the paths where the Navbar should be hidden
    const hideNavbarPaths = ['/login', '/signup'];

    // Check if the current path is in the list of paths where the Navbar should be hidden
    const shouldHideNavbar = hideNavbarPaths.includes(pathname);

    // Log the result of the condition
    console.log('Should hide navbar:', shouldHideNavbar);

    return (
        <html lang="en" className="h-full">
            <body
                suppressHydrationWarning={true}
                className={
                    'bg-background text-foreground h-full ' + poppins.className
                }
            >
                <ThemeProvider>
                    {/* Conditionally render Navbar based on pathname */}
                    {!shouldHideNavbar && <Navbar />}
                    <main>
                        {children}
                        <ChatBot />
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}

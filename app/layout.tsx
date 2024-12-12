

// // //new layout 
// import { Poppins } from 'next/font/google';
// import './globals.css';
// import { ThemeProvider } from "@/components/ThemeProvider";
// import Navbar from '@/components/NavBar';
// import CoffeeAnimation from '@/components/CoffeePourAnimation';
// import { headers } from 'next/headers';
// import Link from 'next/link';
// import AuthButton from '@/components/AuthButton';


// const poppins = Poppins({
//     subsets: ['latin'],
//     weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
// });

// const defaultUrl = process.env.VERCEL_URL
//     ? `https://${process.env.VERCEL_URL}`
//     : 'http://localhost:3000';

// export const metadata = {
//     metadataBase: new URL(defaultUrl),
//     title: 'ImmersiveBrew - Your Personal Coffee Journey',
//     description: 'Discover and perfect your coffee brewing experience with ImmersiveBrew',
//     keywords: ['coffee', 'brewing', 'coffee journal', 'brew guides', 'coffee recipes'],
//     authors: [{ name: 'ImmersiveBrew Team' }],
//     openGraph: {
//         title: 'ImmersiveBrew - Your Personal Coffee Journey',
//         description: 'Discover and perfect your coffee brewing experience',
//         type: 'website',
//         url: defaultUrl,
//     },
// };



// const CoffeeLogo = () => (
//   <svg 
//     width="50" 
//     height="50" 
//     viewBox="0 0 1024 1024"
//     className="text-[#2c1010] transition-transform group-hover:scale-110"
//   >
//      <path d="M107.266322 248.358744c0-53.952613 43.73219-97.684803 97.684803-97.684803H818.967988c53.952613 0 97.684803 43.73219 97.684803 97.684803v97.684803H107.266322v-97.684803z" fill="#FFF5E6" />
//      <path d="M916.652791 359.99808H107.266322c-7.712928 0-13.954533-6.241605-13.954533-13.954533v-97.684803c0-61.55701 50.082327-111.639336 111.639336-111.639337H818.967988c61.55701 0 111.639336 50.082327 111.639336 111.639337v97.684803c0 7.712928-6.241605 13.954533-13.954533 13.954533zM121.220855 332.089014h781.476379v-83.729246c0-46.171085-37.558161-83.729246-83.729246-83.729247H204.951125c-46.171085 0-83.729246 37.558161-83.729246 83.729247v83.729246z" fill="#2c1010" />
//      <path d="M204.951125 346.043547H818.967988v446.55837H204.951125z" fill="#FFFAF5" />
//      <path d="M818.967988 806.55645H204.951125c-7.712928 0-13.954533-6.241605-13.954533-13.954533V346.043547c0-7.712928 6.241605-13.954533 13.954533-13.954533H818.967988c7.712928 0 13.954533 6.241605 13.954533 13.954533v446.55837c0 7.712928-6.241605 13.954533-13.954533 13.954533z m-600.062329-27.91009h586.107795V359.99808H218.905659v418.64828z" fill="#2c1010" />
//      <path d="M107.266322 792.601917c0 46.239685 55.82018 111.639336 125.594894 111.639336h558.197705c69.774713 0 125.594893-65.399651 125.594894-111.639336H107.266322z" fill="#FFFAF5" />
//      <path d="M791.057898 918.195786H232.860192c-75.157278 0-139.549426-69.052874-139.549427-125.594893 0-7.712928 6.241605-13.954533 13.954533-13.954533h809.386469c7.712928 0 13.954533 6.241605 13.954533 13.954533 0.001024 56.543043-64.3901 125.594893-139.548402 125.594893zM123.129378 806.55645c9.716672 37.395364 55.165917 83.729246 109.731838 83.729246h558.197705c54.565921 0 100.015166-46.334906 109.731838-83.729246h-777.661381z" fill="#2c1010" />
//      <path d="M539.869135 443.72835h27.91009v27.91009h-27.91009zM456.139888 443.72835h27.91009v27.91009h-27.91009z" fill="#2c1010" />
//      <path d="M581.733758 750.73627H442.184331a13.973987 13.973987 0 0 1-10.902331-5.233078c-2.398963-3.011247-58.872382-75.089702-58.872382-204.091062 0-7.712928 6.241605-13.954533 13.954533-13.954533h251.188763c7.712928 0 13.954533 6.241605 13.954533 13.954533 0 129.00136-56.473419 201.078791-58.872382 204.091062a13.965796 13.965796 0 0 1-10.901307 5.233078z m-132.353561-27.909067h125.158719c11.461372-17.157246 45.598733-75.634409 48.814756-167.459516H400.565441c3.216024 91.824084 37.353384 150.301246 48.814756 167.459516z" fill="#2c1010" />
//      <path d="M623.598381 387.90817c0 23.113187-18.751436 41.864623-41.864623 41.864623H442.184331c-23.112163 0-41.864623-18.751436-41.864623-41.864623v-41.864623h223.278673v41.864623z" fill="#ACF0F2" />
//      <path d="M581.733758 443.72835H442.184331c-30.78516 0-55.82018-25.033996-55.82018-55.82018v-41.864623c0-7.712928 6.241605-13.954533 13.954533-13.954533h223.278673c7.712928 0 13.954533 6.241605 13.954533 13.954533v41.864623c0.002048 30.78516-25.032972 55.82018-55.818132 55.82018z m-167.459517-83.73027v27.91009c0 15.385925 12.524165 27.91009 27.91009 27.91009H581.733758c15.385925 0 27.91009-12.524165 27.91009-27.91009v-27.91009H414.274241z" fill="#2c1010" />
//      <path d="M358.455085 736.781736c-30.826115 0-55.82018 24.993041-55.82018 55.820181h418.648279c0-30.826115-24.993041-55.82018-55.82018-55.820181H358.455085z" fill="#ACF0F2" />   
//      <path d="M721.283184 806.55645H302.634905c-7.712928 0-13.954533-6.241605-13.954533-13.954533 0-38.471467 31.303246-69.774713 69.774713-69.774714h307.008943c38.471467 0 69.774713 31.303246 69.774713 69.774714 0 7.712928-6.241605 13.954533-13.955557 13.954533z m-402.308093-27.91009h385.968931c-5.764474-16.243941-21.286576-27.91009-39.479994-27.91009H358.455085c-18.193418 0-33.71552 11.666149-39.479994 27.91009z" fill="#2c1010" />
//      <path d="M400.319708 206.494121h223.278673v83.729246h-223.278673z" fill="#F28C13" />
//      <path d="M623.598381 304.178924h-223.278673c-7.712928 0-13.954533-6.241605-13.954533-13.954533v-83.729246c0-7.712928 6.241605-13.954533 13.954533-13.954534h223.278673c7.712928 0 13.954533 6.241605 13.954533 13.954534v83.729246c0.001024 7.712928-6.240581 13.954533-13.954533 13.954533z m-209.32414-27.91009h195.369607v-55.82018H414.274241v55.82018z" fill="#2c1010" />   
//      <path d="M302.634905 234.404211h27.91009v27.91009h-27.91009zM246.815749 234.404211h27.91009v27.91009h-27.91009zM190.995568 234.404211h27.910091v27.91009h-27.910091zM805.013454 234.404211h27.910091v27.91009h-27.910091zM749.193274 234.404211h27.91009v27.91009h-27.91009zM693.373094 234.404211h27.91009v27.91009h-27.91009z" fill="#2c1010" />
//      <path d="M428.229798 834.46654H595.689315v27.91009H428.229798z" fill="#2c1010" />
//      <path d="M665.464028 667.007023h-41.864623v-27.91009h41.864623c7.699618 0 13.954533-6.254915 13.954533-13.954533v-55.82018c0-7.699618-6.254915-13.954533-13.954533-13.954533h-27.91009V527.457597h27.91009c23.085542 0 41.864623 18.779081 41.864623 41.864623v55.82018c0 23.085542-18.779081 41.864623-41.864623 41.864623z" fill="#2c1010" />
//   </svg>
// );

// export const runtime = 'edge';

// export default function RootLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const currentHeaders = headers();
//     const referer = currentHeaders.get('referer') || '';
//     const pathname = referer ? new URL(referer).pathname : '/';

//     const hideNavbarPaths = [
//         '/login',
//         '/signup',
//         '/forgot-password',
//         '/reset-password',
//         '/verify-email',
//         '/error',
//         '/maintenance'
//     ];

//     const shouldHideNavbar = hideNavbarPaths.some(path => 
//         pathname.startsWith(path) || pathname === path
//     );

//     return (
//         <html lang="en" className="h-full scroll-smooth">
//             <head>
//                 <link rel="preconnect" href="https://fonts.googleapis.com" />
//                 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//                 <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
//             </head>
//             <body
//                 suppressHydrationWarning={true}
//                 className={`
//                     min-h-full 
//                     flex 
//                     flex-col 
//                     ${poppins.className}
//                     ${shouldHideNavbar ? '' : 'pt-48'}
//                 `}
//             >
//                 <ThemeProvider
//                     attribute="class"
//                     defaultTheme="system"
//                     enableSystem
//                     disableTransitionOnChange
//                 >
//                     {!shouldHideNavbar && (
//                         <>
//                             <div className="fixed top-6 left-0 w-full z-50">
//                      {/* Static Logo Section */}
//                      <div className="bg-transparent h-24 px-8 pt-4"> {/* Adjusted padding and height */}
//                       <div className="flex items-start"> {/* Changed from items-center to items-start */}
//                       <Link href="/protected" className="flex items-center group relative">
//                        <div className="bg-[#FFF5E6] p-2 border-2 border-[#2c1010] rounded-lg flex items-center space-x-3">
//                         <div className="relative flex-shrink-0">
//                          <CoffeeLogo />
//                         </div>
//                         <span className="text-5xl text-[#2c1010] transition-all duration-300 group-hover:text-[#3d1a1a]" style={{fontFamily: "'Pacifico', cursive"}}>
//                           ImmersiveBrew
//                      </span>
//                  </div>
//              </Link>
//          </div>
//      </div>
//   {/* Centered Navigation Bar */}
//                                 <div className="w-full flex justify-center py-4">
                                    
//                                     <Navbar />
//                                 </div>
//                             </div>
                              

//                             {/* Coffee Bean Animation */}
//                             <CoffeeAnimation />
//                         </>
//                     )}
                    
//                     {/* Main Content Area */}
//                     <main className="flex-1 w-full mx-auto">
//                         <div className="max-w-7xl mx-auto px-4">
//                             {children}
//                         </div>
//                     </main>

//                     {/* Footer */}
//                     {!shouldHideNavbar && (
//                         <footer className="bg-[#2c1010] text-white py-6 mt-8 text-center">
//                             <div className="max-w-7xl mx-auto px-4">
//                                 <p className="text-sm">© 2024 ImmersiveBrew. All rights reserved.</p>
//                                 <p className="text-xs mt-2">
//                                     Crafted with care and a passion for coffee ☕
//                                 </p>
//                             </div>
//                         </footer>
//                     )}

//                     {/* Toast Container */}
//                     <div 
//                         id="toast-container"
//                         className="fixed top-4 right-4 z-50 space-y-2"
//                     />
//                 </ThemeProvider>
//             </body>
//         </html>
//     );
// }

import { Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from '@/components/NavBar';
import CoffeeAnimation from '@/components/CoffeePourAnimation';
import { headers } from 'next/headers';
import Link from 'next/link';
import AuthButton from '@/components/AuthButton';
import ChatBot from '@/components/ChatBot';


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
  >
     <path d="M107.266322 248.358744c0-53.952613 43.73219-97.684803 97.684803-97.684803H818.967988c53.952613 0 97.684803 43.73219 97.684803 97.684803v97.684803H107.266322v-97.684803z" fill="#FFF5E6" />
     <path d="M916.652791 359.99808H107.266322c-7.712928 0-13.954533-6.241605-13.954533-13.954533v-97.684803c0-61.55701 50.082327-111.639336 111.639336-111.639337H818.967988c61.55701 0 111.639336 50.082327 111.639336 111.639337v97.684803c0 7.712928-6.241605 13.954533-13.954533 13.954533zM121.220855 332.089014h781.476379v-83.729246c0-46.171085-37.558161-83.729246-83.729246-83.729247H204.951125c-46.171085 0-83.729246 37.558161-83.729246 83.729247v83.729246z" fill="#2c1010" />
     <path d="M204.951125 346.043547H818.967988v446.55837H204.951125z" fill="#FFFAF5" />
     <path d="M818.967988 806.55645H204.951125c-7.712928 0-13.954533-6.241605-13.954533-13.954533V346.043547c0-7.712928 6.241605-13.954533 13.954533-13.954533H818.967988c7.712928 0 13.954533 6.241605 13.954533 13.954533v446.55837c0 7.712928-6.241605 13.954533-13.954533 13.954533z m-600.062329-27.91009h586.107795V359.99808H218.905659v418.64828z" fill="#2c1010" />
     <path d="M107.266322 792.601917c0 46.239685 55.82018 111.639336 125.594894 111.639336h558.197705c69.774713 0 125.594893-65.399651 125.594894-111.639336H107.266322z" fill="#FFFAF5" />
     <path d="M791.057898 918.195786H232.860192c-75.157278 0-139.549426-69.052874-139.549427-125.594893 0-7.712928 6.241605-13.954533 13.954533-13.954533h809.386469c7.712928 0 13.954533 6.241605 13.954533 13.954533 0.001024 56.543043-64.3901 125.594893-139.548402 125.594893zM123.129378 806.55645c9.716672 37.395364 55.165917 83.729246 109.731838 83.729246h558.197705c54.565921 0 100.015166-46.334906 109.731838-83.729246h-777.661381z" fill="#2c1010" />
     <path d="M539.869135 443.72835h27.91009v27.91009h-27.91009zM456.139888 443.72835h27.91009v27.91009h-27.91009z" fill="#2c1010" />
     <path d="M581.733758 750.73627H442.184331a13.973987 13.973987 0 0 1-10.902331-5.233078c-2.398963-3.011247-58.872382-75.089702-58.872382-204.091062 0-7.712928 6.241605-13.954533 13.954533-13.954533h251.188763c7.712928 0 13.954533 6.241605 13.954533 13.954533 0 129.00136-56.473419 201.078791-58.872382 204.091062a13.965796 13.965796 0 0 1-10.901307 5.233078z m-132.353561-27.909067h125.158719c11.461372-17.157246 45.598733-75.634409 48.814756-167.459516H400.565441c3.216024 91.824084 37.353384 150.301246 48.814756 167.459516z" fill="#2c1010" />
     <path d="M623.598381 387.90817c0 23.113187-18.751436 41.864623-41.864623 41.864623H442.184331c-23.112163 0-41.864623-18.751436-41.864623-41.864623v-41.864623h223.278673v41.864623z" fill="#ACF0F2" />
     <path d="M581.733758 443.72835H442.184331c-30.78516 0-55.82018-25.033996-55.82018-55.82018v-41.864623c0-7.712928 6.241605-13.954533 13.954533-13.954533h223.278673c7.712928 0 13.954533 6.241605 13.954533 13.954533v41.864623c0.002048 30.78516-25.032972 55.82018-55.818132 55.82018z m-167.459517-83.73027v27.91009c0 15.385925 12.524165 27.91009 27.91009 27.91009H581.733758c15.385925 0 27.91009-12.524165 27.91009-27.91009v-27.91009H414.274241z" fill="#2c1010" />
     <path d="M358.455085 736.781736c-30.826115 0-55.82018 24.993041-55.82018 55.820181h418.648279c0-30.826115-24.993041-55.82018-55.82018-55.820181H358.455085z" fill="#ACF0F2" />   
     <path d="M721.283184 806.55645H302.634905c-7.712928 0-13.954533-6.241605-13.954533-13.954533 0-38.471467 31.303246-69.774713 69.774713-69.774714h307.008943c38.471467 0 69.774713 31.303246 69.774713 69.774714 0 7.712928-6.241605 13.954533-13.955557 13.954533z m-402.308093-27.91009h385.968931c-5.764474-16.243941-21.286576-27.91009-39.479994-27.91009H358.455085c-18.193418 0-33.71552 11.666149-39.479994 27.91009z" fill="#2c1010" />
     <path d="M400.319708 206.494121h223.278673v83.729246h-223.278673z" fill="#F28C13" />
     <path d="M623.598381 304.178924h-223.278673c-7.712928 0-13.954533-6.241605-13.954533-13.954533v-83.729246c0-7.712928 6.241605-13.954533 13.954533-13.954534h223.278673c7.712928 0 13.954533 6.241605 13.954533 13.954534v83.729246c0.001024 7.712928-6.240581 13.954533-13.954533 13.954533z m-209.32414-27.91009h195.369607v-55.82018H414.274241v55.82018z" fill="#2c1010" />   
     <path d="M302.634905 234.404211h27.91009v27.91009h-27.91009zM246.815749 234.404211h27.91009v27.91009h-27.91009zM190.995568 234.404211h27.910091v27.91009h-27.910091zM805.013454 234.404211h27.910091v27.91009h-27.910091zM749.193274 234.404211h27.91009v27.91009h-27.91009zM693.373094 234.404211h27.91009v27.91009h-27.91009z" fill="#2c1010" />
     <path d="M428.229798 834.46654H595.689315v27.91009H428.229798z" fill="#2c1010" />
     <path d="M665.464028 667.007023h-41.864623v-27.91009h41.864623c7.699618 0 13.954533-6.254915 13.954533-13.954533v-55.82018c0-7.699618-6.254915-13.954533-13.954533-13.954533h-27.91009V527.457597h27.91009c23.085542 0 41.864623 18.779081 41.864623 41.864623v55.82018c0 23.085542-18.779081 41.864623-41.864623 41.864623z" fill="#2c1010" />
  </svg>
);

export const runtime = 'edge';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentHeaders = headers();
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
                                                <span className="text-4xl text-[#2c1010] transition-all duration-300 group-hover:text-[#3d1a1a]" style={{fontFamily: "'Pacifico', cursive"}}>
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

import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'ImmersiveBrew',
    description: 'ImmersiveBrew',
}

export const runtime = 'edge'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="h-full">
            <body
                suppressHydrationWarning={true}
                className={
                    'bg-background text-foreground h-full ' + poppins.className
                }
            >
                <main
                // className="min-h-screen flex flex-col items-center"
                >
                    {children}
                </main>
            </body>
        </html>
    )
}
import AuthButton from "@/components/AuthButton"
import { useState } from "react"

const exampleEntries = [
    { id: 1, title: 'First Entry', description: 'This is the description for the first entry.', imageUrl: 'https://example.com/image1.jpg', name: 'John Doe', date: '2022-01-01', method: 'v60', grinder: 'Yes', totalTime: '10:00'},
    { id: 2, title: 'Second Entry', description: 'This is the description for the second entry.' },
    { id: 3, title: 'Third Entry', description: 'This is the description for the third entry.' },
];

export default async function Journal() {
    // Fetch journal entries from a server-side function or API
    const entries = exampleEntries;

    return (
        <>
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                    <AuthButton />
                </div>
            </nav>

            <div className="p-4 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Coffee Journal</h1>
                <div className="space-y-4">
                    {entries.map(entry => (
                        <div key={entry.id} className="flex flex-col border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                            {/* Top section with picture, date, and name */}
                            <div className="relative">
                                <img src={entry.imageUrl} alt={entry.name} className="w-full h-40 object-cover" />
                                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black text-white w-full">
                                    <div className="text-xl font-semibold">{entry.name}</div>
                                    <div>{entry.date}</div>
                                </div>
                            </div>
                            
                            {/* Bottom section with details in a grid */}
                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50">
                                <div className="text-coffee-dark">
                                    <strong>Method:</strong> {entry.method}
                                </div>
                                <div className="text-coffee-dark">
                                    <strong>Grinder:</strong> {entry.grinder}
                                </div>
                                <div className="text-coffee-dark">
                                    <strong>Total Time:</strong> {entry.totalTime}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

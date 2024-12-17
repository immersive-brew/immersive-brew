"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

const BudgetEventPage = () => {
    const supabase = createClient();
    const [userId, setUserId] = useState(null);
    const [currentStep, setCurrentStep] = useState('selectBudget'); // Steps: selectBudget, enterLimit, showResults
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [spendingLimit, setSpendingLimit] = useState('');
    const [pairedSelections, setPairedSelections] = useState({
        brewer: null,
        grinder: null,
    });
    const [loading, setLoading] = useState(false);

    // Define the budget options with paired items
    const budgets = [
        {
            label: 'Coffee for Cheap',
            range: '$50 - $150',
            description: 'Basic tools that get the job done at a minimal cost. Great for those just getting started or on a tight budget.',
            details: 'Expect manual grinders and entry-level pour-over devices. You won’t break the bank, but you’ll still brew decent coffee.',
            pairedItems: {
                brewer: [
                    {
                        title: 'Hario v60 (plastic)',
                        cost: '$10',
                        description: 'Cannot go wrong with a classic.',
                        videoUrl: 'https://www.youtube.com/embed/PUufsQ-nBgQ?si=EUxA1PRxsTpJQgE9'
                    },
                    {
                        title: 'Aeropress',
                        cost: '$40',
                        description: 'Truely a modern classic device with unparrallelled ease of use.',
                        videoUrl: 'https://www.youtube.com/embed/tRIX9G7D_9Q?si=0Ch2wrrjM9Ge7jwG'
                    }
                ],
                grinder: [
                    {
                        title: 'TIMEMORE Chestnut C2',
                        cost: '$60',
                        description: 'Bang for your buck device for filter coffee productions.',
                        videoUrl: 'https://www.youtube.com/embed/WEdONli_I8c?si=b9BX5mVcsNcF_PHR'
                    },
                    {
                        title: 'Kinggrinder K6',
                        cost: '$100',
                        description: 'A capable device amazing for filter coffee, but has espresso capabilities built-in.',
                        videoUrl: 'https://www.youtube.com/embed/3hAgWubvdKs?si=fOcYqe2dxJ6EZGp_'
                    }
                ]
            }
        },
        {
            label: 'Middle of the Road',
            range: '$150 - $300',
            description: 'A balance between quality and affordability. Perfect for coffee lovers looking for good value.',
            details: 'You might find burr grinders that produce more consistent grounds, and filters that improve flavor without reaching top-tier prices.',
            pairedItems: {
                brewer: [
                    {
                        title: 'Aeropress',
                        cost: '$40',
                        description: 'It is really that good.',
                        videoUrl: 'https://www.youtube.com/embed/tRIX9G7D_9Q?si=0Ch2wrrjM9Ge7jwG'
                    },
                    {
                        title: 'Chemex',
                        cost: '$50',
                        description: 'A unique take on a classic.',
                        videoUrl: 'https://www.youtube.com/embed/_44o-lCopNU?si=SI94PWFOCTM63t-c'
                    }
                ],
                grinder: [
                    {
                        title: 'Baratza Encore',
                        cost: '$150',
                        description: 'Best Bang for your Buck electric grinder.',
                        videoUrl: 'https://www.youtube.com/embed/kRrzStroKzs?si=ZviXhheXK6-Enc7h'
                    },
                    {
                        title: 'Fellow Opus',
                        cost: '$195',
                        description: 'The aestheic answer to coffee grinding.',
                        videoUrl: 'https://www.youtube.com/embed/lHNI-vTdBRQ?si=kCn71tOp91IYIT0l'
                    }
                ]
            }
        },
        {
            label: 'The Best of the Best',
            range: '$500 - $2000',
            description: 'High-end tools for serious coffee enthusiasts who demand the utmost quality.',
            details: 'Top-of-the-line espresso machines, professional-grade grinders, and the kind of gear used by the world’s best baristas.',
            pairedItems: {
                brewer: [
                    {
                        title: 'Breville Bambino',
                        cost: '$300',
                        description: 'The best step into Espresso creations.',
                        videoUrl: 'https://www.youtube.com/embed/mjrh2jhoqwY?si=HC-RP2VlBnVuru3U'
                    },
                    {
                        title: 'Rancilio Silvia',
                        cost: '$900',
                        description: 'The most elite starter espresso device on the market.',
                        videoUrl: 'https://www.youtube.com/embed/rFe5-OcFq80?si=OALMFGE1GVbhhG5B'
                    }
                ],
                grinder: [
                    {
                        title: 'Fellow Ode Pro',
                        cost: '$400',
                        description: 'One of the best in the world.',
                        videoUrl: 'https://www.youtube.com/embed/rgC6JipvV48?si=gIxLJpI3Oi2tcx7i'
                    },
                    {
                        title: 'Niche Zero',
                        cost: '$650',
                        description: 'Produces the best value from bean to cup.',
                        videoUrl: 'https://www.youtube.com/embed/Lk1s035-380?si=lOOZLOumyjHU3cgP'
                    }
                ]
            }
        }
    ];

    // Fetch the current user on component mount
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
                // Optionally, redirect to login or show a message
            } else if (user) {
                setUserId(user.id);
            }
        };

        fetchUser();
    }, []);

    // Handle budget selection
    const handleBudgetSelect = (budget) => {
        setSelectedBudget(budget);
        setCurrentStep('enterLimit');
    };

    // Handle paired item selection
    const handlePairedSelection = (type, selection) => {
        setPairedSelections(prev => ({
            ...prev,
            [type]: selection
        }));
    };

    // Handle save operation
    const handleSave = async () => {
        if (!selectedBudget || !userId) return;
        if (spendingLimit === '' || isNaN(spendingLimit) || Number(spendingLimit) <= 0) {
            alert('Please enter a valid spending limit.');
            return;
        }
        if (!pairedSelections.brewer || !pairedSelections.grinder) {
            alert('Please select both a brewer and a grinder.');
            return;
        }

        setLoading(true);

        // Update the user's profile with the selected brewing_tools, spending_limit, and paired items
        const { error } = await supabase
            .from('profile')
            .update({
                brewing_tools: selectedBudget.label,
                spending_limit: Number(spendingLimit),
                paired_brewer: pairedSelections.brewer.title,
                paired_grinder: pairedSelections.grinder.title
            })
            .eq('id', userId);

        setLoading(false);

        if (error) {
            console.error('Error saving preferences:', error);
            alert('Unable to save your preferences. Please try again.');
        } else {
            alert(`Your preferences have been saved!`);
            // Optionally, redirect or reset state
            setCurrentStep('selectBudget');
            setSelectedBudget(null);
            setPairedSelections({ brewer: null, grinder: null });
            setSpendingLimit('');
        }
    };

    // Handle spending limit submission
    const handleSpendingLimitSubmit = () => {
        if (spendingLimit === '' || isNaN(spendingLimit) || Number(spendingLimit) <= 0) {
            alert('Please enter a valid spending limit.');
            return;
        }
        setCurrentStep('showResults');
    };

    // If user is not logged in, show a message
    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4">
                <p className="text-lg">Please log in to set your coffee gear preferences.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-8 bg-gray-50 text-gray-900">
            <motion.h1
                className="text-4xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Choose Your Coffee Gear Budget
            </motion.h1>

            {/* Step 1: Select Budget */}
            <AnimatePresence>
                {currentStep === 'selectBudget' && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {budgets.map((b) => (
                            <motion.div
                                key={b.label}
                                className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer border transition"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleBudgetSelect(b)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <h2 className="text-2xl font-semibold mb-2">{b.label}</h2>
                                <p className="text-sm text-gray-600 mb-2">Budget Range: {b.range}</p>
                                <p className="text-sm text-gray-700">{b.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Step 2: Enter Spending Limit */}
            <AnimatePresence>
                {currentStep === 'enterLimit' && selectedBudget && (
                    <motion.div
                        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Set Your Maximum Spending Limit</h2>
                        <div className="mb-4">
                            <label htmlFor="spendingLimit" className="block text-sm font-medium text-gray-700 mb-2">
                                What is your maximum spending limit? ($)
                            </label>
                            <input
                                type="number"
                                id="spendingLimit"
                                name="spendingLimit"
                                value={spendingLimit}
                                onChange={(e) => setSpendingLimit(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter your maximum budget"
                                min="1"
                            />
                        </div>
                        <motion.button
                            className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:bg-gray-400"
                            whileHover={{ scale: spendingLimit && !isNaN(spendingLimit) && Number(spendingLimit) > 0 ? 1.05 : 1 }}
                            whileTap={{ scale: spendingLimit && !isNaN(spendingLimit) && Number(spendingLimit) > 0 ? 0.95 : 1 }}
                            disabled={spendingLimit === '' || isNaN(spendingLimit) || Number(spendingLimit) <= 0}
                            onClick={handleSpendingLimitSubmit}
                        >
                            Continue
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Step 3: Show Results Based on Selection */}
            <AnimatePresence>
                {currentStep === 'showResults' && selectedBudget && (
                    <motion.div
                        className="w-full max-w-5xl mt-8 bg-white p-6 rounded-lg shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">{selectedBudget.label} Package</h2>
                        <p className="text-sm text-gray-700 mb-6">{selectedBudget.details}</p>

                        {/* Brewer Selection */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Choose Your Brewer</h3>
                            <div className="flex space-x-4">
                                {selectedBudget.pairedItems.brewer.map((brewer, index) => (
                                    <motion.div
                                        key={index}
                                        className={`flex-1 p-4 border rounded-lg cursor-pointer 
                      ${pairedSelections.brewer === brewer ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                                        whileHover={{ scale: pairedSelections.brewer !== brewer ? 1.02 : 1 }}
                                        whileTap={{ scale: pairedSelections.brewer !== brewer ? 0.98 : 1 }}
                                        onClick={() => handlePairedSelection('brewer', brewer)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <h4 className="text-lg font-semibold">{brewer.title}</h4>
                                        <p className="text-sm text-gray-600">Cost: {brewer.cost}</p>
                                        <p className="text-sm text-gray-700">{brewer.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Grinder Selection */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Choose Your Grinder</h3>
                            <div className="flex space-x-4">
                                {selectedBudget.pairedItems.grinder.map((grinder, index) => (
                                    <motion.div
                                        key={index}
                                        className={`flex-1 p-4 border rounded-lg cursor-pointer 
                      ${pairedSelections.grinder === grinder ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                                        whileHover={{ scale: pairedSelections.grinder !== grinder ? 1.02 : 1 }}
                                        whileTap={{ scale: pairedSelections.grinder !== grinder ? 0.98 : 1 }}
                                        onClick={() => handlePairedSelection('grinder', grinder)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 + 0.2 }}
                                    >
                                        <h4 className="text-lg font-semibold">{grinder.title}</h4>
                                        <p className="text-sm text-gray-600">Cost: {grinder.cost}</p>
                                        <p className="text-sm text-gray-700">{grinder.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Video Embeds for Selected Items */}
                        <AnimatePresence>
                            {pairedSelections.brewer && pairedSelections.grinder && (
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">{pairedSelections.brewer.title} Video</h4>
                                        <div className="aspect-w-16 aspect-h-9">
                                            <iframe
                                                src={pairedSelections.brewer.videoUrl}
                                                title={`${pairedSelections.brewer.title} Video`}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full rounded-lg"
                                            ></iframe>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">{pairedSelections.grinder.title} Video</h4>
                                        <div className="aspect-w-16 aspect-h-9">
                                            <iframe
                                                src={pairedSelections.grinder.videoUrl}
                                                title={`${pairedSelections.grinder.title} Video`}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full rounded-lg"
                                            ></iframe>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Save and Cancel Buttons */}
                        <div className="flex justify-end space-x-4">
                            <motion.button
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setCurrentStep('selectBudget');
                                    setSelectedBudget(null);
                                    setPairedSelections({ brewer: null, grinder: null });
                                    setSpendingLimit('');
                                }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:bg-gray-400"
                                whileHover={{ scale: (spendingLimit && !isNaN(spendingLimit) && Number(spendingLimit) > 0 && pairedSelections.brewer && pairedSelections.grinder) ? 1.05 : 1 }}
                                whileTap={{ scale: (spendingLimit && !isNaN(spendingLimit) && Number(spendingLimit) > 0 && pairedSelections.brewer && pairedSelections.grinder) ? 0.95 : 1 }}
                                disabled={
                                    loading ||
                                    spendingLimit === '' ||
                                    isNaN(spendingLimit) ||
                                    Number(spendingLimit) <= 0 ||
                                    !pairedSelections.brewer ||
                                    !pairedSelections.grinder
                                }
                                onClick={handleSave}
                            >
                                {loading ? 'Saving...' : 'Save Choice'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BudgetEventPage;

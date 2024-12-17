'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Modal from 'react-modal';

// Define water types with images
const waterTypes = [
  {
    name: 'Third Wave Water (light roast profile)',
    image: '/images/third_wave_water.jpg',
  },
  {
    name: 'Coffee Water',
    image: '/images/coffee_water.jpg',
  },
  {
    name: 'gcwater',
    image: '/images/gcwater.jpg',
  },
  {
    name: 'Aquacode',
    image: '/images/aquacode.jpg',
  },
  {
    name: 'Perfect Coffee Water',
    image: '/images/perfect_coffee_water.jpg',
  },
  {
    name: 'Custom Water',
    image: '/images/custom_water.jpg',
  },
];

// Create a dictionary for quick lookup of images by water type name
const waterTypeImages: { [key: string]: string } = {};
waterTypes.forEach((wt) => {
  waterTypeImages[wt.name] = wt.image;
});

// Popular minerals for custom water
const minerals = [
  'Calcium Chloride',
  'Magnesium Sulfate',
  'Sodium Bicarbonate',
  'Potassium Bicarbonate',
  'Epsom Salt',
  'Gypsum',
];

export default function WaterQualityTracker() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedWaterType, setSelectedWaterType] = useState<any | null>(null);
  const [packetCount, setPacketCount] = useState<number | null>(null);
  const [waterAmount, setWaterAmount] = useState<number | null>(null);
  const [customMinerals, setCustomMinerals] = useState<string[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showResourcesStep, setShowResourcesStep] = useState(true);

  const [waterEntries, setWaterEntries] = useState<any[]>([]);
  const [editingEntryId, setEditingEntryId] = useState<string | number | null>(null);
  const [editingPacketCount, setEditingPacketCount] = useState<number | null>(null);

  // Initialize Supabase client
  const supabase = createClient();

  // Fetch user ID on mount
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) console.error('Error fetching user:', error.message);
      else if (user) {
        setUserId(user.id);
      } else console.log('No user signed in');
    };

    fetchUserId();
  }, [supabase]);

  // Fetch existing water entries for the user
  useEffect(() => {
    const fetchWaterEntries = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('water_tracker')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching water entries:', error.message);
      } else {
        setWaterEntries(data || []);
      }
    };
    fetchWaterEntries();
  }, [userId, supabase]);

  const refreshEntries = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('water_tracker')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching water entries:', error.message);
    } else {
      setWaterEntries(data || []);
    }
  };

  // Handle inline edit of existing water entry
  const handleEditEntry = (entry: any) => {
    setEditingEntryId(entry.id);
    setEditingPacketCount(entry.packet_count);
  };

  const handleIncrement = () => {
    if (editingPacketCount !== null) {
      setEditingPacketCount(editingPacketCount + 1);
    }
  };

  const handleDecrement = () => {
    if (editingPacketCount !== null && editingPacketCount > 0) {
      setEditingPacketCount(editingPacketCount - 1);
    }
  };

  const handleSaveEntry = async (entryId: number) => {
    if (editingPacketCount === null) return;
    const { error } = await supabase
      .from('water_tracker')
      .update({ packet_count: editingPacketCount })
      .eq('id', entryId);

    if (error) {
      console.error('Error updating entry:', error.message);
      setMessage('Failed to update entry.');
    } else {
      setMessage('Entry updated successfully.');
      setEditingEntryId(null);
      setEditingPacketCount(null);
      refreshEntries();
    }
  };

  // Handle delete entry
  const handleDeleteEntry = async (entryId: number) => {
    const { error } = await supabase
      .from('water_tracker')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Error deleting entry:', error.message);
      setMessage('Failed to delete entry.');
    } else {
      setMessage('Entry deleted successfully.');
      refreshEntries();
    }
  };

  // Handle water type selection for main modal
  const handleWaterChoice = (waterType: any) => {
    setSelectedWaterType(waterType);
    setPacketCount(null);
    setWaterAmount(null);
    setCustomMinerals([]);
    setShowResourcesStep(true);
    setModalIsOpen(true);
  };

  // Proceed to the data input step in main modal
  const handleContinue = () => {
    setShowResourcesStep(false);
  };

  // Submit a new water entry from main modal
  const handleSubmit = async () => {
    if (!userId) {
      setMessage('Please log in to track water choices.');
      return;
    }
    if (!selectedWaterType || packetCount === null || waterAmount === null) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const dataToInsert: any = {
      user_id: userId,
      water_type: selectedWaterType.name,
      packet_count: packetCount,
      water_amount: waterAmount,
      date: new Date(),
    };

    if (selectedWaterType.name === 'Custom Water') {
      dataToInsert.minerals_used = customMinerals;
    }

    const { error } = await supabase
      .from('water_tracker')
      .insert([dataToInsert]);

    if (error) {
      console.error('Error uploading data:', error.message);
      setMessage('Failed to upload data. Try again.');
    } else {
      setMessage(`Successfully tracked ${selectedWaterType.name}.`);
      setModalIsOpen(false);
      // Reset state
      setSelectedWaterType(null);
      setPacketCount(null);
      setWaterAmount(null);
      setCustomMinerals([]);
      // Refresh entries
      refreshEntries();
    }
    setLoading(false);
  };

  // Modal custom styles
  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto' as 'auto',
      transform: 'translate(-50%, -50%)',
      borderRadius: '15px',
      padding: '30px',
      width: '90%',
      maxWidth: '500px',
      fontFamily: 'sans-serif',
    },
  };

  // Generate dropdown options
  const packetOptions = Array.from({ length: 11 }, (_, i) => i); // 0 to 10
  const waterAmountOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5); // 0.5 to 5.0 in increments of 0.5

  return (
    <div className="flex flex-col items-center px-6 py-8 font-sans">
      {message && <p className="text-green-700 mb-4">{message}</p>}

      {/* Top Module: Display user's water tracking entries */}
      <div className="w-full max-w-4xl mb-8">
        <h3 className="text-2xl font-bold mb-4">Your Water Tracking</h3>
        {waterEntries.length === 0 ? (
          <p className="text-gray-600">No entries yet. Select a water type below to add one.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {waterEntries.map((entry) => {
              const image = waterTypeImages[entry.water_type] || '/images/custom_water.jpg';
              return (
                <div key={entry.id} className="bg-white shadow rounded-lg p-4 flex flex-col">
                  <div className="w-full h-32 relative mb-4">
                    <Image
                      src={image}
                      alt={entry.water_type}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{entry.water_type}</h4>
                  <div className="flex items-center justify-between mb-3">
                    {editingEntryId === entry.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleDecrement}
                          className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          -
                        </button>
                        <span className="text-gray-700">{editingPacketCount}</span>
                        <button
                          onClick={handleIncrement}
                          className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          +
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => handleSaveEntry(entry.id)}
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          onClick={() => {
                            setEditingEntryId(null);
                            setEditingPacketCount(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-700">Packets: {entry.packet_count}</span>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditEntry(entry)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteEntry(entry.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <motion.h2
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        Track Your Water Quality
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {waterTypes.map((type) => (
          <motion.div
            key={type.name}
            className="bg-white shadow rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.03 }}
            onClick={() => handleWaterChoice(type)}
          >
            <div className="w-full h-32 relative mb-2">
              <Image
                src={type.image}
                alt={type.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-center text-gray-800 font-semibold">{type.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalStyles}
        contentLabel="Input Modal"
        ariaHideApp={false}
      >
        {selectedWaterType && (
          <div className="flex flex-col items-center font-sans">
            <h2 className="text-xl font-bold mb-4">{selectedWaterType.name}</h2>
            <div className="w-32 h-32 relative mb-4">
              <Image
                src={selectedWaterType.image}
                alt={selectedWaterType.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            {showResourcesStep ? (
              <>
                {/* Additional Resources Step */}
                <div className="w-full mb-4">
                  {/* Example video */}
                  <iframe
                    width="100%"
                    height="200"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Resource Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-gray-700 text-center mb-4">
                  Learn about the best practices for using {selectedWaterType.name}.
                </p>
                <div className="flex justify-between w-full">
                  <button
                    onClick={handleContinue}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => setModalIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Input Fields Step */}
                <div className="w-full mb-4">
                  <label className="block font-bold mb-2">
                    Number of Packets:
                    <select
                      className="w-full border rounded p-2 mt-1"
                      value={packetCount !== null ? packetCount : ''}
                      onChange={(e) => setPacketCount(Number(e.target.value))}
                    >
                      <option value="" disabled>Select an option</option>
                      {packetOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="w-full mb-4">
                  <label className="block font-bold mb-2">
                    Amount of Water (in liters):
                    <select
                      className="w-full border rounded p-2 mt-1"
                      value={waterAmount !== null ? waterAmount : ''}
                      onChange={(e) => setWaterAmount(Number(e.target.value))}
                    >
                      <option value="" disabled>Select an option</option>
                      {waterAmountOptions.map((amt) => (
                        <option key={amt} value={amt}>{amt} L</option>
                      ))}
                    </select>
                  </label>
                </div>

                {selectedWaterType.name === 'Custom Water' && (
                  <div className="w-full mb-4">
                    <h3 className="font-bold mb-2">Select Minerals Used:</h3>
                    {minerals.map((mineral) => (
                      <label key={mineral} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          value={mineral}
                          checked={customMinerals.includes(mineral)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomMinerals([...customMinerals, mineral]);
                            } else {
                              setCustomMinerals(
                                customMinerals.filter((m) => m !== mineral)
                              );
                            }
                          }}
                          className="mr-2"
                        />
                        {mineral}
                      </label>
                    ))}
                    <p className="italic text-sm text-gray-600 mt-2">
                      Example: For a balanced brew, you might use Calcium Chloride and Magnesium Sulfate.
                    </p>
                  </div>
                )}
                <div className="flex justify-between w-full mt-4">
                  <button
                    onClick={handleSubmit}
                    className={`px-4 py-2 text-white rounded ${
                      loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    onClick={() => {
                      setModalIsOpen(false);
                      setShowResourcesStep(true);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

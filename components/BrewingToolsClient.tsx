'use client'; 
import React, { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust the import path as needed
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient();

interface ToolOption {
  name: string;
  image: string;
}

interface CustomTool {
  name: string;
  image: File | null;
}

interface SavedTools {
  brewer?: {
    selected?: string[];
    custom?: { name: string; image: string | null };
  };
  grinder?: {
    models?: string[];
    max_clicks?: number;
    custom?: { name: string; image: string | null };
  };
  kettle?: {
    selected?: string[];
    custom?: { name: string; image: string | null };
  };
}

const brewerOptions: ToolOption[] = [
  { name: 'Hario V60', image: 'https://guides.filtru.coffee/images/methods/Hario%20V60.png' },
  { name: 'Chemex', image: 'https://img.freepik.com/premium-vector/chemex-coffee-dripper-paper-filter-logo-vector-icon-illustration_7688-3096.jpg' },
  { name: 'AeroPress', image: 'https://static.vecteezy.com/system/resources/previews/029/597/779/non_2x/aeropress-icon-design-vector.jpg' },
  { name: 'French Press', image: 'https://i.pinimg.com/736x/e0/f2/ab/e0f2abd26c9456273b74c52268bbbcdd.jpg' },
];

const grinderOptions: ToolOption[] = [
  { name: 'Comandante C40', image: 'https://m.media-amazon.com/images/I/71RZV8yKQKL.jpg' },
  { name: 'Baratza Encore', image: 'https://m.media-amazon.com/images/I/51RV+DAkEVL._AC_SL1300_.jpg' },
  { name: 'Fellow Ode', image: 'https://m.media-amazon.com/images/I/81pdO6cLGqL._AC_UF350,350_QL80_.jpg' },
  { name: 'Niche Zero', image: 'https://www.nichecoffee.co.uk/cdn/shop/files/White-63C-dark-grey-bkg-1000px.jpg?v=1727943139&width=1000' },
];

const kettleOptions: ToolOption[] = [
  { name: 'Fellow Stagg EKG', image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202441/0013/fellow-stagg-ekg-pro-electric-pour-over-kettle-o.jpg' },
  { name: 'Brewista Artisan', image: 'https://brewista.co/cdn/shop/products/ArtisanKettleblackonblacksideview_1080x.png?v=1699560840' },
  { name: 'Bonavita Variable', image: 'https://m.media-amazon.com/images/I/7170RydQ8-L._AC_UF894,1000_QL80_.jpg' },
  { name: 'Hario Buono', image: 'https://www.freshroastedcoffee.com/cdn/shop/products/medium_b301588c-cc55-4b16-b740-3a69fd688641_600x600.jpg?v=1703804925' },
];

const BrewingToolsSelector: React.FC = () => {
  const [selectedBrewers, setSelectedBrewers] = useState<string[]>([]);
  const [selectedGrinders, setSelectedGrinders] = useState<string[]>([]);
  const [selectedKettles, setSelectedKettles] = useState<string[]>([]);
  const [grinderClicks, setGrinderClicks] = useState<number>(0);

  const [customBrewer, setCustomBrewer] = useState<CustomTool>({ name: '', image: null });
  const [customGrinder, setCustomGrinder] = useState<CustomTool>({ name: '', image: null });
  const [customKettle, setCustomKettle] = useState<CustomTool>({ name: '', image: null });

  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [currentTools, setCurrentTools] = useState<SavedTools | null>(null);

  useEffect(() => {
    // Fetch the currently authenticated user
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error('Error fetching user:', error);
      } else if (data && data.user) {
        setUserId(data.user.id);
      }
    });
  }, []);

  useEffect(() => {
    // Once we have userId, fetch the currently saved tools
    if (userId) {
      supabase
        .from('profiles')
        .select('tools')
        .eq('id', userId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching current tools:', error);
          } else if (data && data.tools) {
            setCurrentTools(data.tools);
          }
        });
    }
  }, [userId]);

  const handleCheckboxChange = useCallback(
    (
      name: string,
      selectedArray: string[],
      setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      setSelectedArray((prev) =>
        prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
      );
    },
    []
  );

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('tool-images').upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { publicUrl } = supabase.storage.from('tool-images').getPublicUrl(fileName).data || {};
    return publicUrl || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('No user found. Please log in first.');
      return;
    }

    setIsSubmitting(true);

    // Upload custom images if files provided
    const customBrewerImage = customBrewer.image ? await uploadImage(customBrewer.image) : null;
    const customGrinderImage = customGrinder.image ? await uploadImage(customGrinder.image) : null;
    const customKettleImage = customKettle.image ? await uploadImage(customKettle.image) : null;

    const dataToSend = {
      brewer: {
        selected: selectedBrewers,
        custom: customBrewer.name ? { name: customBrewer.name, image: customBrewerImage } : null,
      },
      grinder: {
        models: selectedGrinders,
        max_clicks: grinderClicks,
        custom: customGrinder.name ? { name: customGrinder.name, image: customGrinderImage } : null,
      },
      kettle: {
        selected: selectedKettles,
        custom: customKettle.name ? { name: customKettle.name, image: customKettleImage } : null,
      },
    };

    console.log('Data to send:', dataToSend);

    const { data, error } = await supabase
      .from('profiles')
      .update({ tools: dataToSend })
      .eq('id', userId);

    setIsSubmitting(false);

    if (error) {
      console.error('Error inserting data:', error);
      alert('Error submitting data.');
    } else {
      console.log('Data inserted successfully:', data);
      setShowSuccessPopup(true);
      // Update the current tools state
      setCurrentTools(dataToSend);
    }
  };

  const renderToolOptions = (
    title: string,
    options: ToolOption[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    customTool: CustomTool,
    setCustomTool: React.Dispatch<React.SetStateAction<CustomTool>>
  ) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-bold mb-2">{`Select Your ${title}`}</h2>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label key={option.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selected.includes(option.name)}
              onChange={() => handleCheckboxChange(option.name, selected, setSelected)}
            />
            <img src={option.image} alt={option.name} className="w-10 h-10" />
            <span>{option.name}</span>
          </label>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-1">{`Add a Custom ${title}`}</h3>
        <input
          type="text"
          placeholder={`Custom ${title.toLowerCase()} name`}
          value={customTool.name}
          onChange={(e) => setCustomTool((prev) => ({ ...prev, name: e.target.value }))}
          className="border rounded p-1 w-full mb-2"
        />
        Upload Image:
        <input
          type="file"
          onChange={(e) => setCustomTool((prev) => ({ ...prev, image: e.target.files?.[0] || null }))}
          className="mb-2"
        />
      </div>
    </motion.div>
  );

  if (userId === null) {
    return <div>Loading user...</div>;
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {currentTools && (
        <div className="p-4 bg-gray-100 rounded shadow-md max-w-md mx-auto mt-6 mb-6">
          <h3 className="text-md font-bold mb-2">Currently Saved Brew Tools</h3>
          <div className="text-sm space-y-2">
            {currentTools.brewer?.selected && currentTools.brewer.selected.length > 0 && (
              <div>
                <strong>Brewer(s):</strong> {currentTools.brewer.selected.join(', ')}
              </div>
            )}
            {currentTools.brewer?.custom && (
              <div>
                <strong>Custom Brewer:</strong> {currentTools.brewer.custom.name}{' '}
                {currentTools.brewer.custom.image && (
                  <img src={currentTools.brewer.custom.image} alt={currentTools.brewer.custom.name} className="w-10 h-10 inline-block ml-2" />
                )}
              </div>
            )}

            {currentTools.grinder?.models && currentTools.grinder.models.length > 0 && (
              <div>
                <strong>Grinder(s):</strong> {currentTools.grinder.models.join(', ')}
              </div>
            )}
            {typeof currentTools.grinder?.max_clicks === 'number' && (
              <div>
                <strong>Max Grinder Clicks:</strong> {currentTools.grinder.max_clicks}
              </div>
            )}
            {currentTools.grinder?.custom && (
              <div>
                <strong>Custom Grinder:</strong> {currentTools.grinder.custom.name}{' '}
                {currentTools.grinder.custom.image && (
                  <img src={currentTools.grinder.custom.image} alt={currentTools.grinder.custom.name} className="w-10 h-10 inline-block ml-2" />
                )}
              </div>
            )}

            {currentTools.kettle?.selected && currentTools.kettle.selected.length > 0 && (
              <div>
                <strong>Kettle(s):</strong> {currentTools.kettle.selected.join(', ')}
              </div>
            )}
            {currentTools.kettle?.custom && (
              <div>
                <strong>Custom Kettle:</strong> {currentTools.kettle.custom.name}{' '}
                {currentTools.kettle.custom.image && (
                  <img src={currentTools.kettle.custom.image} alt={currentTools.kettle.custom.name} className="w-10 h-10 inline-block ml-2" />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-4 bg-white rounded shadow-md max-w-md mx-auto mt-10"
      >
        {renderToolOptions(
          'Brewer(s)',
          brewerOptions,
          selectedBrewers,
          setSelectedBrewers,
          customBrewer,
          setCustomBrewer
        )}
        {renderToolOptions(
          'Grinder(s)',
          grinderOptions,
          selectedGrinders,
          setSelectedGrinders,
          customGrinder,
          setCustomGrinder
        )}
        {renderToolOptions(
          'Kettle(s)',
          kettleOptions,
          selectedKettles,
          setSelectedKettles,
          customKettle,
          setCustomKettle
        )}

        {/* Grinder Clicks */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="mt-4"
        >
          <label className="flex flex-col">
            <span className="font-semibold">Set Max Grinder Clicks:</span>
            <input
              type="number"
              min={0}
              value={grinderClicks}
              onChange={(e) => setGrinderClicks(Number(e.target.value))}
              className="border rounded p-1 w-24 mt-1"
            />
          </label>
        </motion.div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
          >
            <motion.div
              className="bg-white rounded p-6 space-y-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold">Success!</h2>
              <p>Your preferences have been saved successfully.</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowSuccessPopup(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BrewingToolsSelector;

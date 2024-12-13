'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust import as needed
const supabase = createClient();

interface ToolOption {
  name: string;
  image: string;
}

// Example data from "the internet" (manually chosen popular options)
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

const BrewingToolsSelector = () => {
  const [selectedBrewers, setSelectedBrewers] = useState<string[]>([]);
  const [selectedGrinders, setSelectedGrinders] = useState<string[]>([]);
  const [selectedKettles, setSelectedKettles] = useState<string[]>([]);
  const [grinderClicks, setGrinderClicks] = useState<number>(0);

  // State for custom brewer
  const [customBrewerName, setCustomBrewerName] = useState('');
  const [customBrewerFile, setCustomBrewerFile] = useState<File | null>(null);

  // State for custom grinder
  const [customGrinderName, setCustomGrinderName] = useState('');
  const [customGrinderFile, setCustomGrinderFile] = useState<File | null>(null);

  // State for custom kettle
  const [customKettleName, setCustomKettleName] = useState('');
  const [customKettleFile, setCustomKettleFile] = useState<File | null>(null);

  const handleCheckboxChange = (
    name: string,
    selectedArray: string[],
    setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedArray.includes(name)) {
      setSelectedArray(selectedArray.filter((item) => item !== name));
    } else {
      setSelectedArray([...selectedArray, name]);
    }
  };

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('tool-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Construct a public URL if the bucket is public
    const {
      data: { publicUrl },
    } = supabase.storage.from('tool-images').getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload custom images if provided
    let customBrewerImageUrl = '';
    let customGrinderImageUrl = '';
    let customKettleImageUrl = '';

    if (customBrewerFile) {
      const url = await uploadImage(customBrewerFile);
      if (url) customBrewerImageUrl = url;
    }

    if (customGrinderFile) {
      const url = await uploadImage(customGrinderFile);
      if (url) customGrinderImageUrl = url;
    }

    if (customKettleFile) {
      const url = await uploadImage(customKettleFile);
      if (url) customKettleImageUrl = url;
    }

    const dataToSend = {
      brewer: {
        selected: selectedBrewers,
        custom: customBrewerName
          ? { name: customBrewerName, image: customBrewerImageUrl }
          : null,
      },
      grinder: {
        models: selectedGrinders,
        max_clicks: grinderClicks,
        custom: customGrinderName
          ? { name: customGrinderName, image: customGrinderImageUrl }
          : null,
      },
      kettle: {
        selected: selectedKettles,
        custom: customKettleName
          ? { name: customKettleName, image: customKettleImageUrl }
          : null,
      },
    };

    console.log('Data to send to Supabase:', dataToSend);

    const { data, error } = await supabase
      .from('your_table_name')
      .insert([{ tools: dataToSend }]);

    if (error) console.error('Error inserting data:', error);
    else console.log('Insertion successful:', data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded shadow-md"
    >
      {/* Brewers */}
      <div>
        <h2 className="text-lg font-bold mb-2">Select Your Brewer(s):</h2>
        <div className="grid grid-cols-2 gap-2">
          {brewerOptions.map((brewer) => (
            <label key={brewer.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBrewers.includes(brewer.name)}
                onChange={() =>
                  handleCheckboxChange(brewer.name, selectedBrewers, setSelectedBrewers)
                }
              />
              <img src={brewer.image} alt={brewer.name} className="w-10 h-10" />
              <span>{brewer.name}</span>
            </label>
          ))}
        </div>
        {/* Custom Brewer */}
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Add a Custom Brewer</h3>
          <input
            type="text"
            placeholder="Custom brewer name"
            value={customBrewerName}
            onChange={(e) => setCustomBrewerName(e.target.value)}
            className="border rounded p-1 w-full mb-2"
          />
          <input
            type="file"
            onChange={(e) => setCustomBrewerFile(e.target.files?.[0] || null)}
            className="mb-2"
          />
        </div>
      </div>

      {/* Grinders */}
      <div>
        <h2 className="text-lg font-bold mb-2">Select Your Grinder(s):</h2>
        <div className="grid grid-cols-2 gap-2">
          {grinderOptions.map((grinder) => (
            <label key={grinder.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedGrinders.includes(grinder.name)}
                onChange={() =>
                  handleCheckboxChange(grinder.name, selectedGrinders, setSelectedGrinders)
                }
              />
              <img src={grinder.image} alt={grinder.name} className="w-10 h-10" />
              <span>{grinder.name}</span>
            </label>
          ))}
        </div>
        <div className="mt-4">
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
        </div>
        {/* Custom Grinder */}
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Add a Custom Grinder</h3>
          <input
            type="text"
            placeholder="Custom grinder name"
            value={customGrinderName}
            onChange={(e) => setCustomGrinderName(e.target.value)}
            className="border rounded p-1 w-full mb-2"
          />
          <input
            type="file"
            onChange={(e) => setCustomGrinderFile(e.target.files?.[0] || null)}
            className="mb-2"
          />
        </div>
      </div>

      {/* Kettles */}
      <div>
        <h2 className="text-lg font-bold mb-2">Select Your Electric Kettle(s):</h2>
        <div className="grid grid-cols-2 gap-2">
          {kettleOptions.map((kettle) => (
            <label key={kettle.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedKettles.includes(kettle.name)}
                onChange={() =>
                  handleCheckboxChange(kettle.name, selectedKettles, setSelectedKettles)
                }
              />
              <img src={kettle.image} alt={kettle.name} className="w-10 h-10" />
              <span>{kettle.name}</span>
            </label>
          ))}
        </div>
        {/* Custom Kettle */}
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Add a Custom Kettle</h3>
          <input
            type="text"
            placeholder="Custom kettle name"
            value={customKettleName}
            onChange={(e) => setCustomKettleName(e.target.value)}
            className="border rounded p-1 w-full mb-2"
          />
          <input
            type="file"
            onChange={(e) => setCustomKettleFile(e.target.files?.[0] || null)}
            className="mb-2"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Save Preferences
        </button>
      </div>
    </form>
  );
};

export default BrewingToolsSelector;

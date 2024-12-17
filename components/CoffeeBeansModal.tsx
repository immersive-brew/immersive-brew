import React, { useState, useEffect } from 'react';

// Comprehensive list of all countries and their coffee regions (if known)
const countryRegions: { [key: string]: string[] } = {
  'Afghanistan': [],
  'Albania': [],
  'Algeria': [],
  'Andorra': [],
  'Angola': [],
  'Antigua and Barbuda': [],
  'Argentina': [],
  'Armenia': [],
  'Australia': [],
  'Austria': [],
  'Azerbaijan': [],
  'Bahamas': [],
  'Bahrain': [],
  'Bangladesh': [],
  'Barbados': [],
  'Belarus': [],
  'Belgium': [],
  'Belize': [],
  'Benin': [],
  'Bhutan': [],
  'Bolivia': [],
  'Bosnia and Herzegovina': [],
  'Botswana': [],
  'Brazil': ['Minas Gerais', 'São Paulo', 'Bahia', 'Espírito Santo', 'Paraná', 'Rio de Janeiro'],
  'Brunei': [],
  'Bulgaria': [],
  'Burkina Faso': [],
  'Burundi': ['Kayanza', 'Ngozi', 'Muyinga', 'Kirundo', 'Gitega', 'Bururi'],
  'Côte d\'Ivoire': [],
  'Cabo Verde': [],
  'Cambodia': [],
  'Cameroon': [],
  'Canada': [],
  'Central African Republic': [],
  'Chad': [],
  'Chile': [],
  'China': ['Yunnan'],
  'Colombia': ['Huila', 'Nariño', 'Tolima', 'Cauca', 'Antioquia', 'Santander', 'Quindío', 'Caldas'],
  'Comoros': [],
  'Congo': [],
  'Costa Rica': ['Tarrazú', 'Central Valley', 'West Valley', 'Brunca', 'Guanacaste', 'Tres Ríos'],
  'Croatia': [],
  'Cuba': [],
  'Cyprus': [],
  'Czech Republic': [],
  'Democratic Republic of the Congo': [],
  'Denmark': [],
  'Djibouti': [],
  'Dominica': [],
  'Dominican Republic': [],
  'Ecuador': ['Loja', 'Pichincha', 'Imbabura', 'Zamora-Chinchipe', 'El Oro', 'Galápagos'],
  'Egypt': [],
  'El Salvador': ['Santa Ana', 'Usulután', 'Ahuachapán', 'La Libertad', 'Sonsonate', 'Chalatenango'],
  'Equatorial Guinea': [],
  'Eritrea': [],
  'Estonia': [],
  'Eswatini': [],
  'Ethiopia': ['Yirgacheffe', 'Sidamo', 'Guji', 'Jimma', 'Limu', 'Harrar', 'Kaffa'],
  'Fiji': [],
  'Finland': [],
  'France': [],
  'Gabon': [],
  'Gambia': [],
  'Georgia': [],
  'Germany': [],
  'Ghana': [],
  'Greece': [],
  'Grenada': [],
  'Guatemala': ['Antigua', 'Atitlán', 'Huehuetenango', 'Cobán', 'San Marcos', 'Acatenango'],
  'Guinea': [],
  'Guinea-Bissau': [],
  'Guyana': [],
  'Haiti': [],
  'Holy See': [],
  'Honduras': ['Copán', 'Santa Barbara', 'Lempira', 'Ocotepeque', 'El Paraíso', 'Comayagua'],
  'Hungary': [],
  'Iceland': [],
  'India': ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Odisha', 'Assam'],
  'Indonesia': ['Sumatra', 'Java', 'Sulawesi', 'Bali', 'Flores', 'Papua'],
  'Iran': [],
  'Iraq': [],
  'Ireland': [],
  'Israel': [],
  'Italy': [],
  'Jamaica': ['Blue Mountains'],
  'Japan': [],
  'Jordan': [],
  'Kazakhstan': [],
  'Kenya': ['Nyeri', 'Kirinyaga', 'Murang\'a', 'Embu', 'Kiambu', 'Thika', 'Bungoma'],
  'Kiribati': [],
  'Kuwait': [],
  'Kyrgyzstan': [],
  'Laos': [],
  'Latvia': [],
  'Lebanon': [],
  'Lesotho': [],
  'Liberia': [],
  'Libya': [],
  'Liechtenstein': [],
  'Lithuania': [],
  'Luxembourg': [],
  'Madagascar': [],
  'Malawi': [],
  'Malaysia': [],
  'Maldives': [],
  'Mali': [],
  'Malta': [],
  'Marshall Islands': [],
  'Mauritania': [],
  'Mauritius': [],
  'Mexico': ['Chiapas', 'Veracruz', 'Oaxaca', 'Puebla', 'Guerrero', 'Jalisco'],
  'Micronesia': [],
  'Moldova': [],
  'Monaco': [],
  'Mongolia': [],
  'Montenegro': [],
  'Morocco': [],
  'Mozambique': [],
  'Myanmar': [],
  'Namibia': [],
  'Nauru': [],
  'Nepal': [],
  'Netherlands': [],
  'New Zealand': [],
  'Nicaragua': ['Jinotega', 'Matagalpa', 'Nueva Segovia', 'Madriz', 'Estelí', 'Boaco'],
  'Niger': [],
  'Nigeria': [],
  'North Korea': [],
  'North Macedonia': [],
  'Norway': [],
  'Oman': [],
  'Pakistan': [],
  'Palau': [],
  'Palestine State': [],
  'Panama': ['Boquete', 'Volcán', 'Renacimiento', 'Santa Clara', 'Coclé', 'Chiriquí'],
  'Papua New Guinea': ['Eastern Highlands', 'Western Highlands', 'Simbu'],
  'Paraguay': [],
  'Peru': ['Cajamarca', 'San Martín', 'Junín', 'Amazonas', 'Cusco', 'Puno'],
  'Philippines': [],
  'Poland': [],
  'Portugal': [],
  'Qatar': [],
  'Romania': [],
  'Russia': [],
  'Rwanda': ['Rulindo', 'Gicumbi', 'Nyamasheke', 'Huye', 'Gakenke', 'Rutsiro'],
  'Saint Kitts and Nevis': [],
  'Saint Lucia': [],
  'Saint Vincent and the Grenadines': [],
  'Samoa': [],
  'San Marino': [],
  'Sao Tome and Principe': [],
  'Saudi Arabia': [],
  'Senegal': [],
  'Serbia': [],
  'Seychelles': [],
  'Sierra Leone': [],
  'Singapore': [],
  'Slovakia': [],
  'Slovenia': [],
  'Solomon Islands': [],
  'Somalia': [],
  'South Africa': [],
  'South Korea': [],
  'South Sudan': [],
  'Spain': [],
  'Sri Lanka': [],
  'Sudan': [],
  'Suriname': [],
  'Sweden': [],
  'Switzerland': [],
  'Syria': [],
  'Tajikistan': [],
  'Tanzania': ['Kilimanjaro', 'Arusha', 'Mbeya', 'Kigoma', 'Ruvuma', 'Kagera'],
  'Thailand': [],
  'Timor-Leste': [],
  'Togo': [],
  'Tonga': [],
  'Trinidad and Tobago': [],
  'Tunisia': [],
  'Turkey': [],
  'Turkmenistan': [],
  'Tuvalu': [],
  'Uganda': ['Bugisu', 'Rwenzori', 'West Nile', 'Bunyoro', 'Ankole', 'Buganda'],
  'Ukraine': [],
  'United Arab Emirates': [],
  'United Kingdom': [],
  'United States': ['Hawaii', 'Puerto Rico'],
  'Uruguay': [],
  'Uzbekistan': [],
  'Vanuatu': [],
  'Venezuela': [],
  'Vietnam': ['Central Highlands', 'Lang Biang', 'Lam Dong', 'Dak Lak', 'Gia Lai', 'Kon Tum'],
  'Yemen': ['Sanani', 'Mattari', 'Hirazi'],
  'Zambia': [],
  'Zimbabwe': []
};

// Coffee varietals
const coffeeVarietals = [
  'Typica', 'Bourbon', 'Caturra', 'Catuai', 'Gesha/Geisha', 'SL28', 'SL34', 'Pacamara',
  'Maragogype', 'Mundo Novo', 'Yellow Bourbon', 'Red Bourbon', 'Pacas', 'Villa Sarchi',
  'Catimor', 'Sarchimor', 'Ruiru 11', 'Batian', 'Castillo', 'Colombia', 'Java', 'Kent',
  'Maracaturra', 'Mokka', 'Obata', 'Rume Sudan', 'Tabi', 'Tekisic', 'Timor Hybrid'
];

// Processing methods
const processingMethods = [
  'Washed', 'Natural', 'Honey', 'Pulped Natural', 'Wet-hulled', 'Semi-washed',
  'Anaerobic', 'Carbonic Maceration', 'Double Fermentation', 'Experimental'
];

// Taste notes categories
const tasteNoteCategories = {
  'Fruity': ['Berry', 'Citrus', 'Stone Fruit', 'Tropical', 'Dried Fruit'],
  'Sweet': ['Chocolate', 'Caramel', 'Honey', 'Vanilla', 'Brown Sugar'],
  'Nutty': ['Almond', 'Hazelnut', 'Peanut', 'Walnut'],
  'Spicy': ['Cinnamon', 'Clove', 'Black Pepper', 'Cardamom'],
  'Floral': ['Jasmine', 'Rose', 'Lavender', 'Orange Blossom'],
  'Herbal': ['Tea-like', 'Grassy', 'Mint', 'Sage']
};

// Grinder types and their setting ranges
const grinderTypes = {
  'Electrical': { min: 1, max: 40 },
  'Burr (Conical)': { min: 1, max: 35 },
  'Blade': { min: 1, max: 10 },
  'Manual': { min: 1, max: 15 },
};

interface CoffeeBeansModalProps {
  onClose: (data?: any, file?: File | null) => void;
}

const CoffeeBeansModal: React.FC<CoffeeBeansModalProps> = ({ onClose }) => {
  // State variables for form data
  const [coffeeName, setCoffeeName] = useState('');
  const [roasterName, setRoasterName] = useState('');
  const [roastDate, setRoastDate] = useState('');
  const [roastLevel, setRoastLevel] = useState('Medium');
  const [bagWeight, setBagWeight] = useState<number | string>(0);
  const [beansRating, setBeansRating] = useState(0);
  const [varietal, setVarietal] = useState('');
  const [processingMethod, setProcessingMethod] = useState('');
  const [tasteNotes, setTasteNotes] = useState<string[]>([]);
  const [isDecaf, setIsDecaf] = useState(false);
  const [isSampleBeans, setIsSampleBeans] = useState(false);
  const [isPreGround, setIsPreGround] = useState(false);
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [farm, setFarm] = useState('');
  const [altitude, setAltitude] = useState<number | string>(0);
  const [grinderType, setGrinderType] = useState('Electrical');
  const [grindSize, setGrindSize] = useState('Medium');
  const [grinderSetting, setGrinderSetting] = useState<number | string>(10);
  const [beanImage, setBeanImage] = useState<File | null>(null);

  // Toggles for collapsible sections
  const [methodNotesOpen, setMethodNotesOpen] = useState(false);

  // Reset region when country changes
  useEffect(() => {
    setRegion('');
  }, [country]);

  const handleSave = () => {
    if (!coffeeName || !roasterName || !roastDate || !roastLevel) {
      alert('Please fill out all required fields');
      return;
    }

    const beansData = {
      coffeeName,
      roasterName,
      roastDate,
      roastLevel,
      bagWeight: Number(bagWeight),
      beansRating,
      varietal,
      processingMethod,
      tasteNotes,
      isDecaf,
      isSampleBeans,
      isPreGround,
      country,
      region,
      farm,
      altitude: Number(altitude),
      grinderType,
      grindSize,
      grinderSetting: Number(grinderSetting),
    };

    onClose(beansData, beanImage);
  };

  // Simple star rating component
  const StarRating = () => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="flex items-center space-x-1">
        <span className="font-bold text-[#4A2C2A]">Rating:</span>
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setBeansRating(star)}
            className="text-yellow-500 text-xl"
          >
            {star <= beansRating ? '★' : '☆'}
          </button>
        ))}
        <span className="text-sm text-[#4A2C2A] ml-2">{beansRating} / 5</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 overflow-y-auto">
      <div className="bg-[#E6D5B8] p-8 rounded-lg relative w-full max-w-2xl m-4">
        <button
          onClick={() => onClose()}
          className="absolute top-2 right-2 p-2 text-[#9C6644] hover:text-[#7F5539] transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#4A2C2A]">Add Coffee Beans</h2>

        <div className="space-y-5">
          {/* Coffee Name and Roaster */}
          <input
            type="text"
            value={coffeeName}
            onChange={(e) => setCoffeeName(e.target.value)}
            className="w-full p-3 bg-white border border-[#C7A17A] rounded text-[#4A2C2A] text-lg"
            placeholder="Coffee Name *"
          />

          <input
            type="text"
            value={roasterName}
            onChange={(e) => setRoasterName(e.target.value)}
            className="w-full p-3 bg-white border border-[#C7A17A] rounded text-[#4A2C2A] text-lg"
            placeholder="Roaster Name *"
          />

          {/* Roast Date and Level */}
          <div className="flex space-x-4">
            <input
              type="date"
              value={roastDate}
              onChange={(e) => setRoastDate(e.target.value)}
              className="flex-1 p-3 bg-white border border-[#C7A17A] rounded text-[#4A2C2A] text-lg"
            />
            <select
              value={roastLevel}
              onChange={(e) => setRoastLevel(e.target.value)}
              className="flex-1 p-3 bg-white border border-[#C7A17A] rounded text-[#4A2C2A] text-lg"
            >
              <option value="Light">Light</option>
              <option value="Medium-Light">Medium-Light</option>
              <option value="Medium">Medium</option>
              <option value="Medium-Dark">Medium-Dark</option>
              <option value="Dark">Dark</option>
            </select>
          </div>

          {/* Bag Weight */}
          <div>
            <label className="block text-[#4A2C2A] text-sm font-bold mb-2">Bag Weight (grams)</label>
            <input
              type="number"
              value={bagWeight}
              onChange={(e) => setBagWeight(e.target.value)}
              className="w-full p-3 bg-white border border-[#C7A17A] rounded text-[#4A2C2A] text-lg"
              placeholder="e.g. 250"
            />
          </div>

          {/* Bean Rating */}
          <StarRating />

          {/* Image Upload */}
          <div>
            <label className="block text-[#4A2C2A] text-sm font-bold mb-2">Upload Bean Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBeanImage(e.target.files ? e.target.files[0] : null)}
              className="w-full p-2 bg-white border border-[#C7A17A] rounded"
            />
            <p className="text-sm text-gray-600">
              By uploading, you agree to share this image in the Community Bean Tracking Module (BTM).
            </p>
          </div>

          {/* Method and Notes Section */}
          <button
            className="w-full text-left text-[#9C6644] font-bold py-3 text-lg"
            onClick={() => setMethodNotesOpen(!methodNotesOpen)}
          >
            Method and Taste Notes {methodNotesOpen ? '▼' : '▶'}
          </button>
          {methodNotesOpen && (
            <div className="space-y-3">
              <select
                value={varietal}
                onChange={(e) => setVarietal(e.target.value)}
                className="w-full p-3 bg-white border border-[#C7A17A] rounded text-[#4A2C2A] text-lg"
              >
                <option value="">Select Varietal</option>
                {coffeeVarietals.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <select
                value={processingMethod}
                onChange={(e) => setProcessingMethod(e.target.value)}
                className="w-full p-3 bg-white border border-[#C7A17A] rounded text-[#4A2C2A] text-lg"
              >
                <option value="">Select Processing Method</option>
                {processingMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              <div>
                <p className="font-bold text-[#4A2C2A]">Taste Notes:</p>
                {Object.entries(tasteNoteCategories).map(([category, notes]) => (
                  <div key={category}>
                    <p>{category}</p>
                    {notes.map((note) => (
                      <button
                        key={note}
                        onClick={() =>
                          setTasteNotes((prev) =>
                            prev.includes(note)
                              ? prev.filter((n) => n !== note)
                              : [...prev, note]
                          )
                        }
                        className={`px-2 py-1 m-1 text-sm rounded ${
                          tasteNotes.includes(note)
                            ? 'bg-[#9C6644] text-white'
                            : 'border border-[#C7A17A] text-[#4A2C2A]'
                        }`}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#9C6644] text-white font-bold rounded hover:bg-[#7F5539] transition-colors"
          >
            Save Coffee Beans
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeBeansModal;

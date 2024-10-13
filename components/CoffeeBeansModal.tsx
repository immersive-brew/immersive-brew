import { useState } from 'react';

const CoffeeBeansModal = ({ onClose = () => {} }) => {
  const [coffeeName, setCoffeeName] = useState('');
  const [roasterName, setRoasterName] = useState('');
  const [roastDate, setRoastDate] = useState('');
  const [roasterLevel, setRoasterLevel] = useState('');
  const [bagWeight, setBagWeight] = useState('');
  const [beansRating, setBeansRating] = useState(0);
  const [varietal, setVarietal] = useState('');
  const [processingMethod, setProcessingMethod] = useState('');
  const [tasteNotes, setTasteNotes] = useState('');
  const [isDecaf, setIsDecaf] = useState(false);
  const [isSampleBeans, setIsSampleBeans] = useState(false);
  const [isPreGround, setIsPreGround] = useState(false);
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [farm, setFarm] = useState('');
  const [altitude, setAltitude] = useState('');
  const [grindSize, setGrindSize] = useState('Coarse');
  const [grinderSetting, setGrinderSetting] = useState('');

  const [methodNotesOpen, setMethodNotesOpen] = useState(false);
  const [producerOriginOpen, setProducerOriginOpen] = useState(false);
  const [grinderSettingOpen, setGrinderSettingOpen] = useState(false);

  const handleSave = () => {
    if (!coffeeName || !roasterName || !roastDate || !roasterLevel || !bagWeight) {
      alert('Please fill out all required fields');
      return;
    }

    const beansData = {
      coffeeName,
      roasterName,
      roastDate,
      roasterLevel,
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
      altitude,
      grindSize,
      grinderSetting,
    };

    onClose(beansData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 overflow-y-auto">
      <div className="bg-gray-900 p-6 rounded-lg relative w-full max-w-md m-4">
        <button
          onClick={() => onClose(null)}
          className="absolute top-2 left-2 p-2 text-yellow-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Add Coffee Beans</h2>

        <div className="space-y-4">
          <input
            type="text"
            value={coffeeName}
            onChange={(e) => setCoffeeName(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Coffee Name"
          />
          <input
            type="text"
            value={roasterName}
            onChange={(e) => setRoasterName(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Roaster Name"
          />
          <input
            type="date"
            value={roastDate}
            onChange={(e) => setRoastDate(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          />
          <input
            type="text"
            value={roasterLevel}
            onChange={(e) => setRoasterLevel(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Roaster Level"
          />
          <input
            type="number"
            value={bagWeight}
            onChange={(e) => setBagWeight(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Bag Weight (g)"
          />

          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setBeansRating(star)}
                className={`text-2xl ${beansRating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                ★
              </button>
            ))}
          </div>

          <div>
            <button 
              className="w-full text-left text-yellow-500 font-bold py-2"
              onClick={() => setMethodNotesOpen(!methodNotesOpen)}
            >
              Method and taste notes {methodNotesOpen ? '▼' : '▶'}
            </button>
            {methodNotesOpen && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={varietal}
                  onChange={(e) => setVarietal(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Varietal"
                />
                <input
                  type="text"
                  value={processingMethod}
                  onChange={(e) => setProcessingMethod(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Processing method"
                />
                <textarea
                  value={tasteNotes}
                  onChange={(e) => setTasteNotes(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Taste notes"
                />
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isDecaf}
                      onChange={(e) => setIsDecaf(e.target.checked)}
                      className="mr-2"
                    />
                    Decaf
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSampleBeans}
                      onChange={(e) => setIsSampleBeans(e.target.checked)}
                      className="mr-2"
                    />
                    Sample Beans
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isPreGround}
                      onChange={(e) => setIsPreGround(e.target.checked)}
                      className="mr-2"
                    />
                    Pre-Ground
                  </label>
                </div>
              </div>
            )}
          </div>

          <div>
            <button 
              className="w-full text-left text-yellow-500 font-bold py-2"
              onClick={() => setProducerOriginOpen(!producerOriginOpen)}
            >
              Producer and origin {producerOriginOpen ? '▼' : '▶'}
            </button>
            {producerOriginOpen && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Country"
                />
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Region"
                />
                <input
                  type="text"
                  value={farm}
                  onChange={(e) => setFarm(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Farm"
                />
                <input
                  type="text"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Altitude"
                />
              </div>
            )}
          </div>

          <div>
            <button 
              className="w-full text-left text-yellow-500 font-bold py-2"
              onClick={() => setGrinderSettingOpen(!grinderSettingOpen)}
            >
              Grinder setting {grinderSettingOpen ? '▼' : '▶'}
            </button>
            {grinderSettingOpen && (
              <div className="space-y-2">
                <select
                  value={grindSize}
                  onChange={(e) => setGrindSize(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="Coarse">Coarse</option>
                  <option value="Medium">Medium</option>
                  <option value="Fine">Fine</option>
                </select>
                <input
                  type="text"
                  value={grinderSetting}
                  onChange={(e) => setGrinderSetting(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Grinder setting"
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full p-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition-all mt-4"
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default CoffeeBeansModal;
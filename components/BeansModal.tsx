import { useState } from 'react'; // Importing useState hook from React for managing component state

// Defining the BeansModal component, receiving onClose as a prop (defaulting to an empty function if none is provided)
const BeansModal = ({ onClose = () => {} }) => {
  
  // Initializing state for coffeeName, roasterName, roastDate, roasterLevel, and beansRating
  const [coffeeName, setCoffeeName] = useState(''); // coffeeName state initialized as an empty string
  const [roasterName, setRoasterName] = useState(''); // roasterName state initialized as an empty string
  const [roastDate, setRoastDate] = useState(''); // roastDate state initialized as an empty string
  const [roasterLevel, setRoasterLevel] = useState(''); // roasterLevel state initialized as an empty string
  const [beansRating, setBeansRating] = useState(0); // beansRating state initialized to 0
  
  // Function to handle rating changes when the user selects a star
  const handleRatingChange = (rating) => {
    setBeansRating(rating); // Updating beansRating state based on the selected rating
  };

  // Function to handle saving of beans data
  const handleSave = () => {
    // If any required fields are empty, alert the user and stop execution
    if (!coffeeName || !roasterName || !roastDate || !roasterLevel) {
      alert('Please fill out all fields'); // Alert if validation fails
      return; // Stop execution if fields are not complete
    }

    // Creating an object with the current state values to represent the bean details
    const beansData = {
      coffeeName, // coffeeName field
      roasterName, // roasterName field
      roastDate, // roastDate field
      roasterLevel, // roasterLevel field
      beansRating, // beansRating field
    };

    // Calling the onClose prop function, passing the beansData object to the parent component
    onClose(beansData); // Pass the collected data back to parent when the modal is closed
  };

  // JSX to render the modal content
  return (
    // Container for the modal, covering the entire screen with a semi-transparent background
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      
      {/* Modal content box with padding and rounded corners */}
      <div className="bg-gray-800 p-6 rounded-lg relative">
        
        {/* Button to close the modal without saving, triggering onClose with null */}
        <button
          onClick={() => onClose(null)} // Call onClose with null to discard the changes
          className="absolute top-2 left-2 p-2 bg-[#D4A373] text-black rounded" // Styling for the back button
        >
          Back
        </button>

        {/* Title for the modal */}
        <h2 className="text-xl font-bold mb-4">Add Coffee Beans</h2>

        {/* Input field for the coffee name */}
        <div className="mb-4">
          <label className="block text-sm font-bold">Coffee Name:</label> {/* Label for input */}
          <input
            type="text" // Text input for coffee name
            value={coffeeName} // Binding the value to coffeeName state
            onChange={(e) => setCoffeeName(e.target.value)} // Update state when the user types
            className="w-full p-2 bg-black border border-gray-600 rounded" // Styling for the input field
            placeholder="Enter coffee name" // Placeholder text
          />
        </div>

        {/* Input field for the roaster name */}
        <div className="mb-4">
          <label className="block text-sm font-bold">Roaster Name:</label> {/* Label for input */}
          <input
            type="text" // Text input for roaster name
            value={roasterName} // Binding the value to roasterName state
            onChange={(e) => setRoasterName(e.target.value)} // Update state when the user types
            className="w-full p-2 bg-black border border-gray-600 rounded" // Styling for the input field
            placeholder="Enter roaster name" // Placeholder text
          />
        </div>

        {/* Input field for the roast date */}
        <div className="mb-4">
          <label className="block text-sm font-bold">Roast Date:</label> {/* Label for input */}
          <input
            type="date" // Date input for roast date
            value={roastDate} // Binding the value to roastDate state
            onChange={(e) => setRoastDate(e.target.value)} // Update state when the user changes the date
            className="w-full p-2 bg-black border border-gray-600 rounded" // Styling for the input field
          />
        </div>

        {/* Input field for the roaster level */}
        <div className="mb-4">
          <label className="block text-sm font-bold">Roaster Level:</label> {/* Label for input */}
          <input
            type="text" // Text input for roaster level
            value={roasterLevel} // Binding the value to roasterLevel state
            onChange={(e) => setRoasterLevel(e.target.value)} // Update state when the user types
            className="w-full p-2 bg-black border border-gray-600 rounded" // Styling for the input field
            placeholder="Enter roaster level" // Placeholder text
          />
        </div>

        {/* Star rating system using 5 stars */}
        <div className="flex mb-4">
          {/* Iterating over an array of numbers (1 to 5) to render 5 star buttons */}
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => handleRatingChange(star)}> {/* Set rating on click */}
              {/* Displaying stars: yellow for selected stars, gray for unselected */}
              <span className={beansRating >= star ? 'text-yellow-500' : 'text-gray-400'}>
                ★
              </span>
            </button>
          ))}
        </div>

        {/* Button to save the bean details, calls handleSave when clicked */}
        <button
          onClick={handleSave} // Call handleSave when clicked
          className="w-full p-2 bg-[#D4A373] text-black rounded hover:bg-[#c78d5d] transition-all" // Styling for save button
        >
          Save Beans
        </button>
      </div>
    </div>
  );
};

export default BeansModal; // Exporting the BeansModal component as default

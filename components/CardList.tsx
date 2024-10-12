'use client';
import { useEffect, useState } from 'react';
import CustomModal from "./Modal"; // Rename imported Modal to CustomModal
import { createClient } from "@/utils/supabase/client"; // Supabase client utility

// Define the structure of the entry (from the 'entries' table)
interface Entry {
  temperature: number;
  coffee_weight: number;
  water_weight: number;
  grind_setting: number;
  overall_time: number;
}

// Define the structure of the card (from 'communitybrew' with joined 'entries')
interface CardType {
  id: number;
  rating: number; // Average rating
  total_ratings: number;
  ratings_count: number;
  entry: Entry;
}

export default function CardList() {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null); // State to store the currently selected card for the modal
  const [cards, setCards] = useState<CardType[]>([]); // State to store the list of brews/cards

  // Fetch brews from the 'communitybrew' table
  useEffect(() => {
    async function fetchBrews() {
      const supabase = createClient(); // Create a Supabase client instance

      // Fetch community brews with joined entries
      const { data, error } = await supabase
        .from('communitybrew')
        .select(`
          id,
          rating,
          total_ratings,
          ratings_count,
          entries (
            temperature,
            coffee_weight,
            water_weight,
            grind_setting,
            overall_time
          )
        `);

      if (error) {
        console.error("Error fetching brews:", error); // Handle any errors while fetching brews
      } else {
        // Format the fetched data and store it in the `cards` state
        const formattedData = data.map((brew) => ({
          id: brew.id,
          rating: brew.rating,
          total_ratings: brew.total_ratings || 0,
          ratings_count: brew.ratings_count || 0,
          entry: brew.entries
        }));
        setCards(formattedData);
      }
    }

    fetchBrews(); // Fetch the brews when the component mounts
  }, []);

  // Handle rating submission
  const handleRatingSubmit = async (id: number, newRating: number) => {
    if (newRating < 1 || newRating > 5) {
      return; // Do not submit if the rating is outside the valid range (1-5)
    }

    const supabase = createClient(); // Create a Supabase client instance

    // Fetch the current brew data from the 'communitybrew' table
    const { data: brewData, error: fetchError } = await supabase
      .from('communitybrew')
      .select('total_ratings, ratings_count')
      .eq('id', id) // Filter by the brew ID
      .single();

    if (fetchError) {
      console.error("Error fetching brew data:", fetchError); // Handle any errors while fetching brew data
      return;
    }

    // Calculate the updated ratings
    const currentTotalRatings = brewData?.total_ratings || 0;
    const currentRatingsCount = brewData?.ratings_count || 0;
    const updatedTotalRatings = currentTotalRatings + newRating;
    const updatedRatingsCount = currentRatingsCount + 1;
    const updatedAverageRating = updatedTotalRatings / updatedRatingsCount;

    // Update the brew with the new rating
    const { error: updateError } = await supabase
      .from('communitybrew')
      .update({
        rating: updatedAverageRating,
        total_ratings: updatedTotalRatings,
        ratings_count: updatedRatingsCount
      })
      .eq('id', id); // Update the brew where the ID matches

    if (updateError) {
      console.error("Error submitting rating:", updateError); // Handle any errors while submitting the new rating
    } else {
      // Update the local state to reflect the new rating
      const updatedCards = cards.map(card =>
        card.id === id ? {
          ...card,
          rating: updatedAverageRating,
          total_ratings: updatedTotalRatings,
          ratings_count: updatedRatingsCount
        } : card
      );
      setCards(updatedCards);
    }
  };

  return (
    <div className="card-list-container">
      {selectedCard && (
        <CustomModal
          title={`Brew #${selectedCard.id}`} // Modal title with the brew ID
          content={`Temperature: ${selectedCard.entry.temperature}°C, Coffee Weight: ${selectedCard.entry.coffee_weight}g, Water Weight: ${selectedCard.entry.water_weight}g, Grind Setting: ${selectedCard.entry.grind_setting}, Overall Time: ${selectedCard.entry.overall_time}s`}
          onClose={() => setSelectedCard(null)} // Close modal on action
        />
      )}

      {cards.length > 0 ? (
        cards.map((card) => (
          <Card
            key={card.id} // Unique key for each card
            id={card.id}
            temperature={card.entry.temperature}
            coffee_weight={card.entry.coffee_weight}
            water_weight={card.entry.water_weight}
            grind_setting={card.entry.grind_setting}
            overall_time={card.entry.overall_time}
            rating={card.rating}
            onClick={() => setSelectedCard(card)} // Set the selected card to show details in modal
            onRateSubmit={handleRatingSubmit} // Pass the rating submission handler
          />
        ))
      ) : (
        <p>No brews available.</p> // Show if no brews are available
      )}
    </div>
  );
}

// Card component that displays individual brew information
interface CardProps {
  id: number;
  temperature: number;
  coffee_weight: number;
  water_weight: number;
  grind_setting: number;
  overall_time: number;
  rating: number; // Displayed average rating
  onClick: () => void; // Click handler for expanding the card or opening the modal
  onRateSubmit: (id: number, newRating: number) => void; // Rating submission handler
}

function Card({ id, temperature, coffee_weight, water_weight, grind_setting, overall_time, rating, onClick, onRateSubmit }: CardProps) {
  const [newRating, setNewRating] = useState(0); // State to store the user's input for new rating
  const [error, setError] = useState(""); // State to store error message for invalid rating
  const [isExpanded, setIsExpanded] = useState(false); // State to manage expanded/collapsed view

  // Handle rating change from user input
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 1 || value > 5) {
      setError("Rating must be between 1 and 5"); // Set an error if the rating is out of bounds
    } else {
      setError(""); // Clear error if rating is valid
    }
    setNewRating(value);
  };

  // Submit the rating using the parent's onRateSubmit handler
  const submitRating = () => {
    if (newRating >= 1 && newRating <= 5) {
      onRateSubmit(id, newRating);
    }
  };

  // Toggle the expanded/collapsed view of the card
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`card ${isExpanded ? 'expanded' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '20px', cursor: 'pointer' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Brew #{id}</h3>
          {/* Expand button in top right corner */}
          <button onClick={toggleExpand} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
            {isExpanded ? '⤡' : '⤢'}
          </button>
        </div>
        {isExpanded && (
          <>
            {/* Expanded view shows additional brew details */}
            <p>Temperature: {temperature}°C</p>
            <p>Coffee Weight: {coffee_weight}g</p>
            <p>Water Weight: {water_weight}g</p>
            <p>Grind Setting: {grind_setting}</p>
            <p>Overall Time: {overall_time}s</p>
          </>
        )}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        {/* User input for a new rating */}
        <div className="rating-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label>
            Your Rating:
            <input 
              type="number" 
              value={newRating}
              onChange={handleRatingChange}
              min={1}
              max={5}
              style={{ marginLeft: '10px' }}
            />
          </label>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={submitRating} style={{ marginTop: '5px' }} disabled={newRating < 1 || newRating > 5}>Submit Rating</button>
        </div>

        {/* Display the average rating */}
        <p style={{ textAlign: 'right', fontWeight: 'bold' }}>
          Average Rating: {rating.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

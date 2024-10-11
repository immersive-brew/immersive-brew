"use client";
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
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    async function fetchBrews() {
      const supabase = createClient();

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
        console.error("Error fetching brews:", error);
      } else {
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

    fetchBrews();
  }, []);

  const handleRatingSubmit = async (id: number, newRating: number) => {
    if (newRating < 1 || newRating > 5) {
      return; // Do not submit if rating is outside the valid range
    }

    const supabase = createClient();
    const { data: brewData, error: fetchError } = await supabase
      .from('communitybrew')
      .select('total_ratings, ratings_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Error fetching brew data:", fetchError);
      return;
    }

    const currentTotalRatings = brewData?.total_ratings || 0;
    const currentRatingsCount = brewData?.ratings_count || 0;
    const updatedTotalRatings = currentTotalRatings + newRating;
    const updatedRatingsCount = currentRatingsCount + 1;
    const updatedAverageRating = updatedTotalRatings / updatedRatingsCount;

    const { error: updateError } = await supabase
      .from('communitybrew')
      .update({
        rating: updatedAverageRating,
        total_ratings: updatedTotalRatings,
        ratings_count: updatedRatingsCount
      })
      .eq('id', id);

    if (updateError) {
      console.error("Error submitting rating:", updateError);
    } else {
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
          title={`Brew #${selectedCard.id}`}
          content={`Temperature: ${selectedCard.entry.temperature}°C, Coffee Weight: ${selectedCard.entry.coffee_weight}g, Water Weight: ${selectedCard.entry.water_weight}g, Grind Setting: ${selectedCard.entry.grind_setting}, Overall Time: ${selectedCard.entry.overall_time}s`}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {cards.length > 0 ? (
        cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            temperature={card.entry.temperature}
            coffee_weight={card.entry.coffee_weight}
            water_weight={card.entry.water_weight}
            grind_setting={card.entry.grind_setting}
            overall_time={card.entry.overall_time}
            rating={card.rating}
            onClick={() => setSelectedCard(card)}
            onRateSubmit={handleRatingSubmit}
          />
        ))
      ) : (
        <p>No brews available.</p>
      )}
    </div>
  );
}

// Card component using flexbox for layout consistency
interface CardProps {
  id: number;
  temperature: number;
  coffee_weight: number;
  water_weight: number;
  grind_setting: number;
  overall_time: number;
  rating: number; // Displayed average rating
  onClick: () => void;
  onRateSubmit: (id: number, newRating: number) => void;
}

function Card({ id, temperature, coffee_weight, water_weight, grind_setting, overall_time, rating, onClick, onRateSubmit }: CardProps) {
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 1 || value > 5) {
      setError("Rating must be between 1 and 5");
    } else {
      setError("");
    }
    setNewRating(value);
  };

  const submitRating = () => {
    if (newRating >= 1 && newRating <= 5) {
      onRateSubmit(id, newRating);
    }
  };

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

'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Import your custom Supabase client
import { useRouter } from 'next/navigation'; // Import router for navigation

const coffeeRecommendations: Record<string, { advice: string; output: string }> = {
  Dull: {
    advice: "Use a finer grind and extract more.",
    output: "Richer, more complex cup of coffee.",
  },
  Savoury: {
    advice: "Use a finer grind or more brew time.",
    output: "More balanced and flavorful.",
  },
  Powdery: {
    advice: "Use a coarser grind or less coffee.",
    output: "More clarity and sweetness.",
  },
  Bitter: {
    advice: "Extract Less, Use More Coffee.",
    output: "Richer, Fruitier Cup of Coffee.",
  },
  Strong: {
    advice: "Use less coffee or more water.",
    output: "Milder, less overwhelming taste.",
  },
  Heavy: {
    advice: "Reduce brew time or coffee amount.",
    output: "A smoother, lighter cup.",
  },
  Pleasant: {
    advice: "Perfect extraction! Keep brewing the same.",
    output: "The best possible flavor!",
  },
  Intense: {
    advice: "Use a coarser grind and less coffee.",
    output: "Balanced, less overpowering.",
  },
  Overwhelming: {
    advice: "Extract less, use a coarser grind.",
    output: "Balanced and less bitter.",
  },
};

const CoffeeWheel: React.FC = () => {
  const [selectedTaste, setSelectedTaste] = useState<keyof typeof coffeeRecommendations>('Bitter');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // To store the user's ID
  const router = useRouter(); // Router instance for navigation

  // Fetch the user's session to get their ID
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient(); // Initialize Supabase client
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id); // Set the user ID from the session
      } else {
        console.error('User not logged in');
      }
    };

    fetchUser();
  }, []);

  const handleTasteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTaste(event.target.value as keyof typeof coffeeRecommendations);
  };

  const { advice, output } = coffeeRecommendations[selectedTaste];

  const handleSubmit = async () => {
    if (!userId) {
      console.error('No user ID available');
      alert('Please log in to submit feedback.');
      return;
    }

    setLoading(true);
    const supabase = createClient(); // Use your custom Supabase client

    try {
      // Update the latest_feedback field for the logged-in user in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          latest_feedback: {
            feedback_user: selectedTaste,
            feedback_suggestion: advice,
            feedback_expected_output: output,
          },
        })
        .eq('id', userId); // Update only the row with the logged-in user's ID

      if (error) {
        console.error('Error updating feedback:', error);
        alert('An error occurred while submitting your feedback. Please try again.');
      } else {
        alert('Feedback submitted successfully!'); // Ensure alert fires
        router.push('/protected/journal'); // Redirect to /protected/journal after alert
      }
    } catch (err) {
      console.error('Unexpected error during submission:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>How was your coffee?</h2>
      <select
        value={selectedTaste}
        onChange={handleTasteChange}
        style={{ padding: '10px', fontSize: '16px' }}
      >
        {Object.keys(coffeeRecommendations).map((taste) => (
          <option key={taste} value={taste}>
            {taste}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        <p>
          <strong>You should:</strong> {advice}
        </p>
        <p>
          <strong>Expected Output:</strong> {output}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
};

export default CoffeeWheel;

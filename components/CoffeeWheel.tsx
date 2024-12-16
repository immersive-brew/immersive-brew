'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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

// Example flavor data structure
const flavorCategories = {
  Fruity: ["Berry", "Citrus", "Stone Fruit"],
  Floral: ["Jasmine", "Rose", "Lavender"],
  Roasted: ["Dark Chocolate", "Nutty", "Caramel"],
  Spicy: ["Cinnamon", "Clove", "Cardamom"],
};

const CoffeeWheel: React.FC = () => {
  const [selectedTaste, setSelectedTaste] = useState<keyof typeof coffeeRecommendations>('Bitter');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const router = useRouter();

  // Fetch the user's session to get their ID
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
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
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          latest_feedback: {
            feedback_user: selectedTaste,
            feedback_suggestion: advice,
            feedback_expected_output: output,
          },
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating feedback:', error);
        alert('An error occurred while submitting your feedback. Please try again.');
      } else {
        alert('Feedback submitted successfully!');
        router.push('/protected/journal');
      }
    } catch (err) {
      console.error('Unexpected error during submission:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
    setSelectedFlavor(null);
  };

  const getArcColor = (category: string) => {
    if (selectedCategory === category) {
      return '#ffd700'; // highlighted color
    }
    return '#ffa500'; // default color
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <h2>How was your coffee?</h2>

      {/* Flavor Wheel Container */}
      <div style={{ 
        position: 'relative', 
        width: '300px', 
        height: '300px', 
        margin: '20px auto', 
        borderRadius: '50%', 
        background: '#ddd'
      }}>
        {/* Center Coffee Circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#6b4e16',
            color: '#fff',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
        >
          Coffee
        </div>

        {/* Fruity Arc (Top-Left) */}
        <div 
          onClick={() => handleCategoryClick('Fruity')}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '150px',
            height: '150px',
            borderBottomRightRadius: '150px',
            background: getArcColor('Fruity'),
            cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            fontWeight: 'bold'
          }}>
            Fruity
          </div>
        </div>

        {/* Floral Arc (Top-Right) */}
        <div 
          onClick={() => handleCategoryClick('Floral')}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '150px',
            height: '150px',
            borderBottomLeftRadius: '150px',
            background: getArcColor('Floral'),
            cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            fontWeight: 'bold'
          }}>
            Floral
          </div>
        </div>

        {/* Roasted Arc (Bottom-Right) */}
        <div 
          onClick={() => handleCategoryClick('Roasted')}
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '150px',
            height: '150px',
            borderTopLeftRadius: '150px',
            background: getArcColor('Roasted'),
            cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            fontWeight: 'bold'
          }}>
            Roasted
          </div>
        </div>

        {/* Spicy Arc (Bottom-Left) */}
        <div 
          onClick={() => handleCategoryClick('Spicy')}
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '150px',
            height: '150px',
            borderTopRightRadius: '150px',
            background: getArcColor('Spicy'),
            cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            fontWeight: 'bold'
          }}>
            Spicy
          </div>
        </div>
      </div>

      {/* Sub-flavors list */}
      {selectedCategory && (
        <div style={{ marginTop: '20px' }}>
          <h3>{selectedCategory} Flavors</h3>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {flavorCategories[selectedCategory as keyof typeof flavorCategories].map((flavor) => (
              <div
                key={flavor}
                onClick={() => setSelectedFlavor(flavor)}
                style={{
                  padding: '10px',
                  border: selectedFlavor === flavor ? '2px solid #000' : '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {flavor}
              </div>
            ))}
          </div>
          {selectedFlavor && <p>Selected Flavor: {selectedFlavor}</p>}
        </div>
      )}

      <select
        value={selectedTaste}
        onChange={handleTasteChange}
        style={{ padding: '10px', fontSize: '16px', marginTop: '20px' }}
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

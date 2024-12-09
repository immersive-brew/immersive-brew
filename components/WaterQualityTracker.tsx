'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Modal from 'react-modal';

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

  // Initialize Supabase client
  const supabase = createClient();

  // Fetch the user ID when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) console.error('Error fetching user:', error.message);
      else if (user) setUserId(user.id);
      else console.log('No user signed in');
    };

    fetchUserId();
  }, [supabase]);

  // Water types with images
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

  // Popular minerals for custom water
  const minerals = [
    'Calcium Chloride',
    'Magnesium Sulfate',
    'Sodium Bicarbonate',
    'Potassium Bicarbonate',
    'Epsom Salt',
    'Gypsum',
  ];

  // Handle water type selection
  const handleWaterChoice = (waterType: any) => {
    setSelectedWaterType(waterType);
    setPacketCount(null);
    setWaterAmount(null);
    setCustomMinerals([]);
    setShowResourcesStep(true);
    setModalIsOpen(true);
  };

  // Proceed to the data input step
  const handleContinue = () => {
    setShowResourcesStep(false);
  };

  // Handle submission to Supabase
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

    const { data, error } = await supabase
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
    }
    setLoading(false);
  };

  // Modal custom styles
  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      borderRadius: '15px',
      padding: '30px',
      width: '90%',
      maxWidth: '500px',
    },
  };

  // Generate dropdown options
  const packetOptions = Array.from({ length: 11 }, (_, i) => i); // 0 to 10
  const waterAmountOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5); // 0.5 to 5.0 in increments of 0.5

  // Inline styles object
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      padding: '30px',
    },
    title: {
      fontSize: '2em',
      marginBottom: '20px',
    },
    message: {
      color: 'green',
      marginBottom: '20px',
    },
    waterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '20px',
      width: '100%',
      maxWidth: '800px',
    },
    waterCard: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      cursor: 'pointer',
    },
    waterImage: {
      borderRadius: '10px',
    },
    modalContent: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
    },
    modalImage: {
      borderRadius: '10px',
      marginBottom: '20px',
    },
    label: {
      width: '100%',
      marginBottom: '15px',
      fontWeight: 'bold' as 'bold',
    },
    select: {
      width: '100%',
      padding: '10px',
      marginTop: '5px',
      fontSize: '1em',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '5px',
      color: '#333',
    },
    mineralsSection: {
      width: '100%',
      marginTop: '20px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    exampleText: {
      fontStyle: 'italic',
      color: '#555',
      marginTop: '10px',
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: '30px',
    },
    submitButton: {
      padding: '10px 20px',
      backgroundColor: '#0070f3',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    submitButtonDisabled: {
      backgroundColor: '#999',
      cursor: 'not-allowed',
    },
    cancelButton: {
      padding: '10px 20px',
      backgroundColor: '#eaeaea',
      color: 'black',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    videoContainer: {
      width: '100%',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <motion.h2
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.title}
      >
        Track Your Water Quality
      </motion.h2>
      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.waterGrid}>
        {waterTypes.map((type) => (
          <motion.div
            key={type.name}
            style={styles.waterCard}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleWaterChoice(type)}
          >
            <Image
              src={type.image}
              alt={type.name}
              width={150}
              height={150}
              style={styles.waterImage}
            />
            <p>{type.name}</p>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalStyles}
        contentLabel="Input Modal"
        ariaHideApp={false}
      >
        {selectedWaterType && (
          <div style={styles.modalContent}>
            <h2>{selectedWaterType.name}</h2>
            <Image
              src={selectedWaterType.image}
              alt={selectedWaterType.name}
              width={200}
              height={200}
              style={styles.modalImage}
            />

            {showResourcesStep ? (
              <>
                {/* Additional Resources Step */}
                <div style={styles.videoContainer}>
                  {/* Embed your video or other resources here */}
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
                <p>Learn about the best practices for using {selectedWaterType.name}.</p>
                <div style={styles.modalButtons}>
                  <button
                    onClick={handleContinue}
                    style={styles.submitButton}
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => setModalIsOpen(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Input Fields Step */}
                <label style={styles.label}>
                  Number of Packets:
                  <select
                    style={styles.select}
                    value={packetCount !== null ? packetCount : ''}
                    onChange={(e) => setPacketCount(Number(e.target.value))}
                  >
                    <option value="" disabled>Select an option</option>
                    {packetOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </label>

                <label style={styles.label}>
                  Amount of Water (in liters):
                  <select
                    style={styles.select}
                    value={waterAmount !== null ? waterAmount : ''}
                    onChange={(e) => setWaterAmount(Number(e.target.value))}
                  >
                    <option value="" disabled>Select an option</option>
                    {waterAmountOptions.map((amt) => (
                      <option key={amt} value={amt}>{amt} L</option>
                    ))}
                  </select>
                </label>

                {selectedWaterType.name === 'Custom Water' && (
                  <div style={styles.mineralsSection}>
                    <h3>Select Minerals Used:</h3>
                    {minerals.map((mineral) => (
                      <label key={mineral} style={styles.checkboxLabel}>
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
                        />
                        {mineral}
                      </label>
                    ))}
                    <p style={styles.exampleText}>
                      Example: For a balanced brew, you might use Calcium Chloride
                      and Magnesium Sulfate.
                    </p>
                  </div>
                )}
                <div style={styles.modalButtons}>
                  <button
                    onClick={handleSubmit}
                    style={{
                      ...styles.submitButton,
                      ...(loading ? styles.submitButtonDisabled : {}),
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    onClick={() => {
                      setModalIsOpen(false);
                      setShowResourcesStep(true);
                    }}
                    style={styles.cancelButton}
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

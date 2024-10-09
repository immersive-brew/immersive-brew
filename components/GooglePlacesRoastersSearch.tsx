"use client";
import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

const GooglePlacesRoastersSearch = () => {
  const [roasters, setRoasters] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const mapRef = useRef<HTMLDivElement | null>(null);  // Ref for the map div
  const mapInstance = useRef<any>(null);  // Ref to store the map instance
  const markersRef = useRef<any[]>([]); // Ref to store the map markers

  // Function to fetch roasters based on the current location
  const fetchRoasters = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/nearbySearch?lat=${latitude}&lng=${longitude}&keyword=roasters&radius=10000`
      );
      const data = await response.json();

      if (response.ok) {
        setRoasters(data.results);
        setLoading(false);

        // Update the map markers
        updateMap(latitude, longitude, data.results);
      } else {
        setError(data.error);
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred while fetching roasters.');
      setLoading(false);
    }
  };

  // Function to get the user's location and fetch roasters
  const getUserLocation = () => {
    console.log("Getting user location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location fetched:", latitude, longitude);
          setLocation({ latitude, longitude });
          setRoasters([]);  // Clear previous roasters before fetching new ones
          clearMarkers(); // Clear existing markers
          fetchRoasters(latitude, longitude); // Fetch roasters based on new location
        },
        () => {
          setError('Failed to retrieve your location.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  // Clear all markers from the map
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null)); // Remove markers from map
    markersRef.current = []; // Clear the markers array
  };

  // Function to update the map with markers
  const updateMap = (latitude: number, longitude: number, places: any[]) => {
    if (!window.google || !mapRef.current) return;

    if (!mapInstance.current) {
      // Create a new map if not initialized
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 12,
      });
    } else {
      // Pan the map to the new location
      mapInstance.current.setCenter({ lat: latitude, lng: longitude });
    }

    // Clear existing markers
    clearMarkers();

    // Add a marker for the user's location
    const userMarker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: mapInstance.current,
      title: 'Your Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });
    markersRef.current.push(userMarker);

    // Add markers for each roaster
    places.forEach((place) => {
      const marker = new google.maps.Marker({
        position: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        map: mapInstance.current,
        title: place.name,
      });

      // Add a click listener to the marker to display the roaster name
      const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${place.name}</h3><p>${place.vicinity}</p>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker);
      });

      markersRef.current.push(marker);
    });
  };

  // Initial effect to fetch the location
  useEffect(() => {
    getUserLocation(); // Fetch location on load
  }, []);

  return (
    <div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
        async
        defer
        onLoad={() => console.log('Google Maps script loaded')}
      />
      <h1>Local Roasters Near You</h1>
      {loading ? (
        <p>Loading roasters near your location...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {/* Map Container */}
          <div
            ref={mapRef}
            style={{
              height: '400px',
              width: '800px',
              marginTop: '20px',
              border: '1px solid black',
            }}
          ></div>

          {/* Formatted List of Roasters */}
          <ul style={{ marginTop: '20px', listStyleType: 'none', padding: 0 }}>
            {roasters.map((roaster) => (
              <li key={roaster.place_id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
                <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2em' }}>{roaster.name}</h3>
                <p style={{ margin: 0, fontSize: '1em', color: '#555' }}>{roaster.vicinity}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GooglePlacesRoastersSearch;

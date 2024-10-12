"use client"; // Ensure this is a client-side component since it relies on browser APIs (e.g., geolocation, Google Maps)
import { useEffect, useState, useRef } from 'react'; // Import React hooks
import Script from 'next/script'; // Import Next.js's Script component to load external scripts (Google Maps API in this case)

// Extend the global window interface to include `google`
declare global {
  interface Window {
    google: any; // Declare that the global window object has a `google` property for Google Maps API
  }
}

// Interface for storing the user's location (latitude and longitude)
interface LocationType {
  latitude: number | null;
  longitude: number | null;
}

const GooglePlacesRoastersSearch = () => {
  // State to hold the list of roasters
  const [roasters, setRoasters] = useState<any[]>([]);
  // State to hold error messages
  const [error, setError] = useState('');
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  // State to store the user's location (latitude and longitude)
  const [location, setLocation] = useState<LocationType>({ latitude: null, longitude: null });

  // References:
  const mapRef = useRef<HTMLDivElement | null>(null);  // Reference for the map div element
  const mapInstance = useRef<any>(null);  // Reference to store the Google Maps instance
  const markersRef = useRef<any[]>([]); // Reference to store the markers on the map

  // Function to fetch nearby roasters using Google Places API, based on the user's location
  const fetchRoasters = async (latitude: number, longitude: number) => {
    setLoading(true); // Set loading to true while fetching
    try {
      // Make a request to your API, which wraps the Google Places API search for 'roasters' around the user's location
      const response = await fetch(
        `/api/nearbySearch?lat=${latitude}&lng=${longitude}&keyword=roasters&radius=10000`
      );
      const data = await response.json();

      // If the response is successful, update the state with the roasters and update the map markers
      if (response.ok) {
        setRoasters(data.results); // Store roasters in state
        setLoading(false); // Stop loading

        // Update the map markers with the fetched roasters
        updateMap(latitude, longitude, data.results);
      } else {
        setError(data.error); // Set error message if request fails
        setLoading(false); // Stop loading
      }
    } catch (err) {
      // Catch any network or request errors and set an error message
      setError('An error occurred while fetching roasters.');
      setLoading(false);
    }
  };

  // Function to get the user's current geolocation and fetch roasters based on it
  const getUserLocation = () => {
    console.log("Getting user location...");
    if (navigator.geolocation) { // Check if geolocation is supported by the browser
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords; // Extract latitude and longitude from the geolocation API
          console.log("Location fetched:", latitude, longitude);
          setLocation({ latitude, longitude }); // Update the location state
          setRoasters([]);  // Clear any previous roasters before fetching new ones
          clearMarkers(); // Clear any existing markers on the map
          fetchRoasters(latitude, longitude); // Fetch roasters using the new location
        },
        () => {
          setError('Failed to retrieve your location.'); // Handle error if the user denies permission or there is a problem
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.'); // Handle case where geolocation is not supported
      setLoading(false);
    }
  };

  // Clear all markers from the map
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null)); // Remove all markers from the map
    markersRef.current = []; // Reset the markers reference
  };

  // Function to update the map with the new markers for roasters and user's location
  const updateMap = (latitude: number, longitude: number, places: any[]) => {
    // Ensure that the Google Maps script is loaded and that the map div reference is available
    if (typeof window.google === 'undefined' || !mapRef.current) return;

    // Initialize the map if it hasn't been initialized yet
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude }, // Center the map on the user's location
        zoom: 12, // Set the zoom level
      });
    } else {
      // Pan the map to the new location if it has already been initialized
      mapInstance.current.setCenter({ lat: latitude, lng: longitude });
    }

    // Clear existing markers before adding new ones
    clearMarkers();

    // Add a marker for the user's current location
    const userMarker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: mapInstance.current,
      title: 'Your Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Use a blue marker for the user
    });
    markersRef.current.push(userMarker); // Add the marker to the markers reference array

    // Add markers for each roaster found in the nearby search
    places.forEach((place) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        map: mapInstance.current,
        title: place.name, // Set the roaster's name as the title for the marker
      });

      // Create an info window that displays the roaster's name and vicinity (address)
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<h3>${place.name}</h3><p>${place.vicinity}</p>`,
      });

      // Add a click event listener to the marker to show the info window
      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker);
      });

      markersRef.current.push(marker); // Add the marker to the markers reference array
    });
  };

  // Initial effect to fetch the user's location when the component is mounted
  useEffect(() => {
    getUserLocation(); // Get the user's location on page load
  }, []);

  return (
    <div>
      {/* Load the Google Maps API script with Places library */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive" // Load the script before the page becomes interactive
        async
        defer
        onLoad={() => console.log('Google Maps script loaded')} // Log when the script has loaded
      />
      <h1>Local Roasters Near You</h1>
      {loading ? (
        <p>Loading roasters near your location...</p> // Show loading message while fetching roasters
      ) : error ? (
        <p>{error}</p> // Display any error messages
      ) : (
        <div>
          {/* Map container for rendering the Google Map */}
          <div
            ref={mapRef} // Reference to the map div
            style={{
              height: '400px',
              width: '800px',
              marginTop: '20px',
              border: '1px solid black',
            }}
          ></div>

          {/* List of roasters displayed below the map */}
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

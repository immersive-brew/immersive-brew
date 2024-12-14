"use client"; // Ensure this is a client-side component since it relies on browser APIs (e.g., geolocation, Google Maps)
import { useEffect, useState, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google: any;
  }
}

interface LocationType {
  latitude: number | null;
  longitude: number | null;
}

const GooglePlacesRoastersSearch = () => {
  const [roasters, setRoasters] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationType>({
    latitude: null,
    longitude: null,
  });

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Fetch roasters
  const fetchRoasters = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/nearbySearch?lat=${latitude}&lng=${longitude}&keyword=roasters&radius=10000`
      );
      const data = await response.json();

      if (response.ok) {
        setRoasters(data.results);
      } else {
        setError(data.error || "Failed to fetch roasters.");
      }
    } catch (err) {
      console.error("Error fetching roasters:", err);
      setError("An error occurred while fetching roasters.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize the map
  const initializeMap = (latitude: number, longitude: number) => {
    if (!mapRef.current || !window.google) {
      console.warn("Map container or Google Maps API is not available yet.");
      return; // Gracefully exit instead of throwing an error
    }

    // Create the map instance
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 12,
    });

    // Add user location marker
    const userMarker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: mapInstance.current,
      title: "Your Location",
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });

    // Add markers for roasters
    roasters.forEach((place) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        map: mapInstance.current,
        title: place.name,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<h3>${place.name}</h3><p>${place.vicinity}</p>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstance.current, marker);
      });

      markersRef.current.push(marker);
    });
  };

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchRoasters(latitude, longitude);
        },
        () => {
          setError("Failed to retrieve your location.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Monitor changes to location or roasters and initialize map when ready
  useEffect(() => {
    if (location.latitude && location.longitude) {
      initializeMap(location.latitude, location.longitude);
    }
  }, [location, roasters]);

  // Fetch user location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
        onLoad={() => console.log("Google Maps script loaded.")}
        onError={() => {
          console.error("Failed to load Google Maps script.");
          setError("Failed to load Google Maps.");
        }}
      />
      <h1>Local Roasters Near You</h1>
      {loading ? (
        <p>Loading roasters near your location...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div
            ref={mapRef}
            style={{
              height: "400px",
              width: "800px",
              marginTop: "20px",
              border: "1px solid black",
            }}
          ></div>
          <ul style={{ marginTop: "20px", listStyleType: "none", padding: 0 }}>
            {roasters.map((roaster) => (
              <li
                key={roaster.place_id}
                style={{
                  marginBottom: "15px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <h3 style={{ margin: 0, fontWeight: "bold", fontSize: "1.2em" }}>
                  {roaster.name}
                </h3>
                <p style={{ margin: 0, fontSize: "1em", color: "#555" }}>
                  {roaster.vicinity}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GooglePlacesRoastersSearch;

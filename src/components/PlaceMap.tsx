"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import Link from "next/link";

// 1. FIX LEAFLET ICONS
const iconFix = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

// 2. HELPER COMPONENT TO HANDLE FLYING
// This "hook" needs to be inside the MapContainer to work
function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14, { duration: 2 }); // Zoom level 14, 2-second flight
    }
  }, [coords, map]);

  return null;
}

// 3. MAIN COMPONENT
export default function PlaceMap({ places }: { places: any[] }) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    iconFix();
  }, []);

  // Function to get real GPS location
  const handleNearMe = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLoading(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const defaultCenter: [number, number] = [45.4215, -75.6972];

  return (
    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 z-0">
      
      {/* THE MAGIC BUTTON */}
      <button 
        onClick={handleNearMe}
        className="absolute top-4 right-4 z-[1000] bg-white text-black font-bold py-2 px-4 rounded-full shadow-md hover:bg-gray-100 flex items-center gap-2 transition"
      >
        {loading ? "Locating..." : "📍 Find Near Me"}
      </button>

      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* This invisible component handles the flight animation */}
        <FlyToLocation coords={userLocation} />

        {/* User's Location Marker (Different Color) */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here! 🧍</Popup>
          </Marker>
        )}

        {/* Shop Markers */}
        {places.map((place) => {
          if (!place.lat || !place.long) return null;
          return (
            <Marker key={place.id} position={[place.lat, place.long]}>
              <Popup>
                <div className="min-w-[150px]">
                  <h3 className="font-bold text-sm mb-1">{place.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{place.category}</p>
                  <Link 
                    href={`/place/${place.slug}`}
                    className="block text-center bg-black text-white text-xs py-1 px-2 rounded hover:bg-gray-800"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Fix for missing Leaflet marker icons
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PlaceMap() {
  const [places, setPlaces] = useState<any[]>([]); 

  useEffect(() => {
    async function fetchPlaces() {
      const { data } = await supabase.from("places").select("*");
      if (data) {
        setPlaces(data);
      }
    }
    fetchPlaces();
  }, []);

  return (
    <MapContainer 
      center={[45.4215, -75.6972]} 
      zoom={13} 
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* FILTER: Only show pins if the place has lat AND long */}
      {places
        .filter(place => place.lat && place.long) 
        .map((place) => (
          <Marker 
              key={place.id} 
              position={[place.lat, place.long]} 
              icon={icon}
          >
            <Popup>
              <div className="text-center">
                  <h3 className="font-bold text-lg">{place.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{place.category}</p>
                  <Link href={`/place/${place.slug}`} className="text-blue-600 underline text-sm">
                      View Details
                  </Link>
              </div>
            </Popup>
          </Marker>
      ))}
    </MapContainer>
  );
}
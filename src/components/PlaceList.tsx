"use client";

import Link from "next/link";
import { useState } from "react";

export default function PlaceList({ places }: { places: any[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Filter the places based on search text AND category
  const filteredPlaces = places.filter((place) => {
    const matchesSearch = place.name.toLowerCase().includes(search.toLowerCase()) || 
                          place.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = category === "all" || place.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full">
      
      {/* 🔍 SEARCH & FILTERS BAR */}
      <div className="mb-10 space-y-4">
        
        {/* Search Input */}
        <input 
          type="text" 
          placeholder="Search for coffee, wifi, cozy spots..." 
          className="w-full p-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-black outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "coffee", "tea", "cacao"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition ${
                category === cat 
                  ? "bg-black text-white shadow-lg" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat === "all" ? "All Spots" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🧊 THE GRID (Displays filtered results) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaces.map((place) => (
          <Link 
            href={`/place/${place.slug}`} 
            key={place.id}
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="h-48 bg-gray-200 relative">
              <img 
                src={place.image_url || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80"} 
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-neutral-800">
                {place.category}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">{place.name}</h3>
              <p className="text-neutral-500 text-sm line-clamp-2 mb-4">
                {place.description}
              </p>
              <div className="flex items-center text-orange-600 text-sm font-medium">
                View Details <span className="ml-1 group-hover:translate-x-1 transition">→</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Empty State Message */}
        {filteredPlaces.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <p className="text-xl">No spots found matching "{search}"</p>
            <button onClick={() => {setSearch(""); setCategory("all")}} className="text-orange-600 font-bold mt-2 hover:underline">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
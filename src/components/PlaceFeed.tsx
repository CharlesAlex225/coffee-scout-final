"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link for internal navigation

// UPDATED: Added 'slug' to the type definition
type Place = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  address: string | null;
  editorial_summary: string | null;
  vibe_tags: string[] | null;
};

const categoryLabels: Record<string, string> = {
  coffee: "Coffee Shop",
  tea: "Tea House",
  cacao: "Chocolatier",
};

function getPlaceholderImage(category: string | null) {
  if (category === "coffee") return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80";
  if (category === "tea") return "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80";
  if (category === "cacao") return "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80";
  return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"; 
}

export default function PlaceFeed({ places }: { places: Place[] }) {
  const [filter, setFilter] = useState("all");

  const filteredPlaces = places.filter((place) => {
    if (filter === "all") return true;
    return place.category === filter;
  });

  return (
    <div>
      {/* FILTER TABS */}
      <div className="flex justify-center mb-10">
        <div className="flex gap-2 p-1 bg-gray-100/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-inner">
          {["all", "coffee", "tea", "cacao"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === cat
                  ? "bg-white text-black shadow-sm transform scale-105"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {cat === "all" ? "All" : categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* FEED GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaces.map((place) => {
          const displayCategory = place.category
            ? categoryLabels[place.category] || place.category
            : "uncategorized";
            
          const imageUrl = getPlaceholderImage(place.category);

          return (
            // WRAPPER LINK: The whole card is now a link to the details page
            <Link 
              key={place.id} 
              href={`/place/${place.slug}`}
              className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {displayCategory}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                  {place.name}
                </h2>

                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                  <span className="inline-block w-4 h-4 text-gray-400">📍</span>
                  {place.address?.split(",")[0] ?? "Ottawa"}
                </p>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {place.editorial_summary}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2 flex-wrap">
                  {place.vibe_tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-gray-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Fake 'Button' look for the Read More action */}
                <div className="mt-6 w-full py-3 bg-gray-50 text-black text-sm font-semibold rounded-xl flex items-center justify-center gap-2 group-hover:bg-black group-hover:text-white transition-colors">
                   View Details →
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {filteredPlaces.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 font-medium">No places found in this category yet.</p>
          </div>
        )}
    </div>
  );
}
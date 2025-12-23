"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PlaceList({ search, category }: { search: string, category: string }) {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaces() {
      const { data, error } = await supabase.from("places").select("*");
      if (error) console.error("Error:", error);
      else setPlaces(data || []);
      setLoading(false);
    }
    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = 
      place.name.toLowerCase().includes(search.toLowerCase()) || 
      place.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || place.category === category;
    return matchesSearch && matchesCategory;
  });

  // Helper function to get a nice image based on category
  const getImage = (cat: string) => {
    if (cat === "tea") return "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80";
    if (cat === "cacao") return "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80";
    // Default to Coffee
    return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80";
  }

  if (loading) return <div className="text-center py-10 text-gray-500">Loading spots...</div>;
  if (filteredPlaces.length === 0) return <div className="text-center py-10 text-gray-400">No places found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPlaces.map((place) => (
        <Link href={`/place/${place.slug}`} key={place.id} className="group block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
          
          {/* IMAGE SECTION */}
          <div className="h-48 bg-gray-200 relative overflow-hidden">
             <img 
               src={getImage(place.category)} 
               alt={place.name} 
               className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
             />
             <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                {place.category}
             </div>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">{place.name}</h3>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2">{place.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
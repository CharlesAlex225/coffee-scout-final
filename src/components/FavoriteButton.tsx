"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FavoriteButton({ placeId }: { placeId: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Check if the user has ALREADY favorited this spot
  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("place_id", placeId)
        .maybeSingle();

      if (data) setIsFavorited(true);
      setLoading(false);
    };

    checkFavorite();
  }, [placeId]);

  // 2. Handle the Click (Toggle)
  const toggleFavorite = async () => {
    if (!userId) {
      alert("Please login to save favorites!");
      return;
    }

    // Optimistic Update (Switch color instantly)
    setIsFavorited(!isFavorited);

    if (isFavorited) {
      // Remove it 💔
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("place_id", placeId);
    } else {
      // Add it ❤️
      await supabase
        .from("favorites")
        .insert([{ user_id: userId, place_id: placeId }]);
    }
  };

  if (loading) return <span className="text-gray-300 px-2">...</span>;

  return (
    <button 
      onClick={toggleFavorite}
      className={`p-2 rounded-full border transition-all shadow-sm ${
        isFavorited 
          ? "bg-red-50 border-red-200 text-red-500 scale-110" 
          : "bg-white border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200"
      }`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill={isFavorited ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        strokeWidth={2} 
        stroke="currentColor" 
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    </button>
  );
}
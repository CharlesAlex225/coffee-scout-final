"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProfilePage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]); // 👈 New State for Favorites
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check Login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      const userName = user.email?.split("@")[0];

      // 2. Fetch Reviews
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*, places(name, slug)") 
        .eq("user_name", userName);

      if (reviewData) setReviews(reviewData);

      // 3. Fetch Favorites (The new part!) 🕵️‍♂️
      // We ask for the favorite entry, AND the actual place details linked to it
      const { data: favData } = await supabase
        .from("favorites")
        .select("*, places(*)") 
        .eq("user_id", user.id);

      if (favData) setFavorites(favData);
      
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 text-center">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            {user.email[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Profile</h1>
          <p className="text-gray-500">{user.email}</p>
          
          <div className="mt-6 flex justify-center gap-4">
             <Link href="/" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">
                ← Back to Map
             </Link>
             <button 
                onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/");
                }}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100"
             >
                Sign Out
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* COLUMN 1: MY SAVED SPOTS ❤️ */}
            <div>
                <h2 className="text-xl font-bold mb-4 px-2 flex items-center gap-2">
                    ❤️ Saved Spots ({favorites.length})
                </h2>
                {favorites.length === 0 ? (
                    <div className="text-gray-400 bg-white p-6 rounded-xl border border-gray-100 text-center">
                        No favorites yet. Go find some!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {favorites.map((fav) => (
                            <Link 
                                href={`/place/${fav.places.slug}`} 
                                key={fav.id}
                                className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition hover:border-black"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">{fav.places.name}</span>
                                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-full uppercase">
                                        {fav.places.category}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* COLUMN 2: MY REVIEWS ✍️ */}
            <div>
                <h2 className="text-xl font-bold mb-4 px-2 flex items-center gap-2">
                    ✍️ My Reviews ({reviews.length})
                </h2>
                {reviews.length === 0 ? (
                    <div className="text-gray-400 bg-white p-6 rounded-xl border border-gray-100 text-center">
                        You haven't reviewed anything yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start">
                            <Link href={`/place/${review.places?.slug}`} className="font-bold hover:underline text-black">
                                {review.places?.name || "Unknown Spot"}
                            </Link>
                            <span className="text-yellow-500 text-sm">{"⭐".repeat(review.rating)}</span>
                            </div>
                            <p className="text-gray-600 mt-2 text-sm italic">"{review.comment}"</p>
                        </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}
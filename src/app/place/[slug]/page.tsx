"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import Link from "next/link";
import AddReviewForm from "@/components/AddReviewForm";
import FavoriteButton from "@/components/FavoriteButton"; // 👈 The new button!

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PlacePage() {
  const { slug } = useParams();
  const [place, setPlace] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      // 1. Fetch Place
      const { data: placeData, error } = await supabase
        .from("places")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching place:", error);
        setLoading(false);
        return;
      }
      setPlace(placeData);

      // 2. Fetch Reviews
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("place_id", placeData.id)
        .order("created_at", { ascending: false });

      if (reviewData) setReviews(reviewData);
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading spot...</div>;
  if (!place) return <div className="text-center py-20">Place not found!</div>;

  // Calculate Average Rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
      : "New";

  // Helper for Hero Image based on category
  const getImage = (cat: string) => {
    if (cat === "tea") return "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1600&q=80";
    if (cat === "cacao") return "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=1600&q=80";
    return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={getImage(place.category)}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-4xl mx-auto text-white">
            <Link href="/" className="text-sm uppercase tracking-widest hover:underline opacity-80 mb-2 block">
              ← Back to Map
            </Link>

            {/* HEADER with Heart Button */}
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-5xl font-extrabold">{place.name}</h1>
              {/* The Heart Button! */}
              <FavoriteButton placeId={place.id} />
            </div>

            {/* BADGES */}
            <div className="flex gap-2 mt-4">
              <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {place.category}
              </span>
              <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                ★ {averageRating} <span className="text-gray-400 font-normal">({reviews.length} reviews)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Info */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{place.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400 italic">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">{review.user_name || "Anonymous"}</span>
                      <span className="text-yellow-500 text-sm">{"⭐".repeat(review.rating)}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Action */}
        <div>
          <div className="bg-gray-50 p-6 rounded-2xl sticky top-24 border border-gray-100">
            <h3 className="font-bold text-xl mb-4">Write a Review</h3>
            <AddReviewForm placeId={place.id} onReviewAdded={(newReview) => setReviews([newReview, ...reviews])} />
          </div>
        </div>
      </div>
    </div>
  );
}
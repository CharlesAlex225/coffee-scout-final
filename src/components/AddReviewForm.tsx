"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AddReviewForm({ placeId }: { placeId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // Store the logged-in user

  // Check if user is logged in when the component loads
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    
    // Use the logged-in email as the name (or "Anonymous" if something fails)
    const userName = user?.email?.split("@")[0] || "Anonymous";

    const newReview = {
      place_id: placeId,
      user_name: userName, // Auto-filled from Auth
      rating: parseInt(formData.get("rating") as string),
      comment: formData.get("comment"),
    };

    const { error } = await supabase.from("reviews").insert([newReview]);

    if (error) {
      alert("Error submitting review: " + error.message);
    } else {
      setIsOpen(false);
      router.refresh();
    }
    setLoading(false);
  }

  // 1. If NOT logged in, show a "Login" button instead of the form
  if (!user) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
        <p className="text-gray-600 mb-4">Want to leave a review?</p>
        <Link href="/login" className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition">
          Login / Sign Up
        </Link>
      </div>
    );
  }

  // 2. If Logged in but form is closed
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-6 w-full py-3 border-2 border-black font-bold text-black rounded-xl hover:bg-black hover:text-white transition"
      >
        + Write a Review
      </button>
    );
  }

  // 3. The Form (Logged In)
  return (
    <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Write a Review ✍️</h3>
        <button onClick={() => setIsOpen(false)} className="text-sm text-gray-500 hover:text-red-500">Cancel</button>
      </div>

      <div className="mb-4 text-sm text-gray-500 bg-white p-2 rounded border border-gray-100">
        Posting as: <span className="font-bold text-black">{user.email}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* We removed the "Name" input because we know who they are now! */}

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
          <select name="rating" className="w-full p-2 border rounded-lg bg-white">
            <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
            <option value="4">⭐⭐⭐⭐ (Good)</option>
            <option value="3">⭐⭐⭐ (Okay)</option>
            <option value="2">⭐⭐ (Bad)</option>
            <option value="1">⭐ (Terrible)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comment</label>
          <textarea name="comment" required rows={3} placeholder="How was the coffee?" className="w-full p-2 border rounded-lg" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800"
        >
          {loading ? "Posting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
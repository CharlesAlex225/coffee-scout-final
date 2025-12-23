import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddReviewForm from "@/components/AddReviewForm";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Force dynamic rendering so we see new reviews instantly
export const revalidate = 0;

export default async function PlaceDetails(props: { params: Promise<{ slug: string }> }) {
  
  // 1. Await the params
  const params = await props.params;

  // 2. Fetch the Place
  const { data: places } = await supabase
    .from("places")
    .select("*")
    .eq("slug", params.slug);

  const place = places?.[0];

  if (!place) return notFound();

  // 3. Fetch the Reviews (WE DO THIS FIRST)
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("place_id", place.id)
    .order("created_at", { ascending: false });

  // 4. Calculate Average (WE DO THIS SECOND - Safe now!)
  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Image */}
      <div className="h-[400px] relative">
        <img
          src={place.image_url || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80"}
          className="w-full h-full object-cover"
          alt={place.name}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-4xl mx-auto text-white">
            <Link href="/" className="text-sm uppercase tracking-widest hover:underline opacity-80 mb-2 block">← Back to Map</Link>
            <h1 className="text-5xl font-extrabold mb-2">{place.name}</h1>
            
            {/* NEW: Category + Rating Badge */}
            <div className="flex gap-2 mt-4">
              <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {place.category}
              </span>
              <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                ★ {averageRating} <span className="text-gray-400 font-normal">({reviews?.length} reviews)</span>
              </span>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Spot</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{place.description}</p>
          </div>

          <hr className="border-gray-200" />

          {/* REVIEWS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Community Reviews 💬</h3>
            </div>
            
            {/* The Review Form Button */}
            <AddReviewForm placeId={place.id} />
            
            <div className="h-6"></div> 

            {/* If no reviews yet */}
            {reviews?.length === 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500">
                No reviews yet. Be the first to try it!
              </div>
            )}

            {/* List of Reviews */}
            <div className="space-y-4">
              {reviews?.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{review.user_name}</span>
                    <span className="text-orange-500 font-bold">{"★".repeat(review.rating)}<span className="text-gray-300">{"★".repeat(5 - review.rating)}</span></span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Info Card */}
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <h3 className="font-bold text-gray-900 mb-4">Visit Info</h3>
            
            <div className="h-40 bg-gray-100 rounded-lg mb-6 overflow-hidden relative">
               <img 
                 src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" 
                 className="w-full h-full object-cover opacity-50" 
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <a 
                   href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.long}`} 
                   target="_blank"
                   className="bg-white text-xs font-bold px-3 py-2 rounded shadow hover:bg-gray-50"
                 >
                   Open in Google Maps ↗
                 </a>
               </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                 <span>📍</span> 
                 <span>{place.lat ? "Coordinates available" : "Location hidden"}</span>
              </div>
              <div className="flex items-center gap-3">
                 <span>📶</span> 
                 <span>Free Wifi usually available</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { calculateDateScore } from "@/lib/ranking";

export const revalidate = 0;

export default async function DateRankingPage() {
  const { data: places } = await supabase.from("places").select("*");

  // Calculate & Sort by Date Score
  const rankedPlaces = (places || [])
    .map((place) => ({ ...place, dateScore: calculateDateScore(place) }))
    .sort((a, b) => b.dateScore - a.dateScore)
    .filter((place) => place.dateScore > 4); 

  return (
    <div className="min-h-screen bg-rose-50 pb-20">
      {/* HEADER: Warm/Romantic Theme */}
      <div className="bg-rose-950 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-rose-200 text-sm font-bold mb-4 inline-block hover:text-white">
            ← Back to Main Discovery
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Best Spots for a <span className="text-rose-300">Coffee Date</span>
          </h1>
          <p className="text-xl text-rose-100 max-w-2xl">
            Intimate corners, cozy seating, and lower noise levels.
            <br />
            <span className="text-sm opacity-70 mt-2 block">
              *Ranked by "Cozy" vibes and comfort.
            </span>
          </p>
        </div>
      </div>

      {/* RANKING LIST */}
      <main className="max-w-3xl mx-auto px-6 -mt-10">
        <div className="space-y-6">
          {rankedPlaces.map((place, index) => (
            <Link 
              key={place.id} 
              href={`/place/${place.slug}`}
              className="block group relative bg-white p-6 rounded-2xl shadow-sm border border-rose-100 hover:shadow-xl hover:scale-[1.01] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                {/* RANK NUMBER */}
                <div className="absolute -left-3 -top-3 w-10 h-10 bg-rose-600 text-white flex items-center justify-center rounded-full font-bold shadow-md">
                  #{index + 1}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-rose-700">
                    {place.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {place.vibe_tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-rose-50 text-rose-800 rounded-md capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {place.category === "cacao" && "🍫 Excellent Dessert Spot"}
                    {place.category === "tea" && "🍵 Quiet Conversation"}
                    {place.category === "coffee" && "☕ Casual Vibe"}
                  </div>
                </div>

                {/* SCORE BADGE */}
                <div className="text-center bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">
                  <div className="text-xs text-rose-600 font-bold uppercase tracking-wider">Score</div>
                  <div className="text-3xl font-black text-rose-900">{place.dateScore}</div>
                  <div className="text-[10px] text-gray-400">/ 10</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
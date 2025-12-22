import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { calculateWorkScore } from "@/lib/ranking";

export const revalidate = 0; // Always fetch fresh data

export default async function WorkRankingPage() {
  const { data: places } = await supabase.from("places").select("*");

  // 1. Calculate Score & 2. Sort by Score (Highest first)
  const rankedPlaces = (places || [])
    .map((place) => ({ ...place, workScore: calculateWorkScore(place) }))
    .sort((a, b) => b.workScore - a.workScore)
    .filter((place) => place.workScore > 4); // Only show "passable" work spots

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="bg-blue-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-blue-200 text-sm font-bold mb-4 inline-block hover:text-white">
            ← Back to Main Discovery
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Best Spots for <span className="text-blue-300">Deep Work</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Ranked by Wi-Fi reliability, noise levels, and table space.
            <br />
            <span className="text-sm opacity-70 mt-2 block">
              *Shops with "No Wifi" are automatically excluded.
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
              className="block group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.01] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                {/* RANK NUMBER */}
                <div className="absolute -left-3 -top-3 w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold shadow-md">
                  #{index + 1}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700">
                    {place.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {place.vibe_tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    {place.amenities?.includes("Wifi") && (
                      <span className="flex items-center text-green-700 font-medium">
                        ✓ Fast Wifi
                      </span>
                    )}
                    {place.amenities?.includes("Work Tables") && (
                      <span className="flex items-center text-blue-700 font-medium">
                        ✓ Work Tables
                      </span>
                    )}
                  </div>
                </div>

                {/* SCORE BADGE */}
                <div className="text-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                  <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Score</div>
                  <div className="text-3xl font-black text-blue-900">{place.workScore}</div>
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
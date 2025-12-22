import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0;

function getPlaceholderImage(category: string | null) {
  if (category === "coffee") return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80";
  if (category === "tea") return "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80";
  if (category === "cacao") return "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80";
  return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80";
}

export default async function Home() {
  const { data: places } = await supabase.from("places").select("*");

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO SECTION */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wider mb-6 uppercase">
            Ottawa, Ontario
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-6">
            Cacao. Tea. <span className="text-gray-400">Coffee.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A curated scout guide to the capital's best roasters, quietest tea rooms, and richest chocolate.
          </p>

          {/* NEW: Curated Collections Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link 
              href="/work" 
              className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-900 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all"
            >
              <span className="text-xl">💻</span> 
              Find Deep Work Spots
            </Link>

            <Link 
              href="/date" 
              className="flex items-center justify-center gap-3 px-6 py-3 bg-rose-900 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all"
            >
              <span className="text-xl">🌹</span> 
              Find Date Spots
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">All Locations</h2>
          <span className="text-sm text-gray-500">{places?.length || 0} spots curated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places?.map((place) => (
            <Link 
              key={place.id} 
              href={`/place/${place.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={getPlaceholderImage(place.category)} 
                  alt={place.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-wider rounded-md text-gray-800">
                    {place.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {place.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {place.editorial_summary}
                </p>
                
                {/* Vibe Tags */}
                <div className="flex flex-wrap gap-2">
                  {place.vibe_tags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold uppercase text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12 text-center">
        <p className="text-gray-400 text-sm">© 2024 Cacao Tea Coffee. Built in Ottawa.</p>
      </footer>
    </div>
  );
} 
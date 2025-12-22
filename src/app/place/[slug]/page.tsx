import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

function getPlaceholderImage(category: string | null) {
  if (category === "coffee") return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80";
  if (category === "tea") return "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1200&q=80";
  if (category === "cacao") return "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80";
  return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80";
}

const categoryLabels: Record<string, string> = {
  coffee: "Coffee Shop",
  tea: "Tea House",
  cacao: "Chocolatier",
};

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: place } = await supabase
    .from("places")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!place) {
    notFound();
  }

  const imageUrl = getPlaceholderImage(place.category);
  const displayCategory = categoryLabels[place.category] || place.category || "Place";
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.name + " " + (place.address || "")
  )}`;

  return (
    <div className="min-h-screen bg-white">
      {/* HERO IMAGE */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img src={imageUrl} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute top-6 left-6 md:top-10 md:left-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-full text-sm font-bold hover:bg-white transition-colors"
          >
            ← Back to Scout
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded-md mb-3">
              {displayCategory}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {place.name}
            </h1>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <main className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Summary & Vibe */}
        <div className="md:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">About the spot</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {place.editorial_summary}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">The Vibe</h3>
            <div className="flex gap-2 flex-wrap">
              {place.vibe_tags?.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* NEW: Display Amenities, Specialties, Dietary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            {place.specialties && place.specialties.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Specialties</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  {place.specialties.map((item: string) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
            
            {place.amenities && place.amenities.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Amenities</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  {place.amenities.map((item: string) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}

            {place.dietary && place.dietary.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Dietary</h4>
                <div className="flex flex-wrap gap-2">
                  {place.dietary.map((item: string) => (
                    <span key={item} className="text-xs border border-green-200 bg-green-50 text-green-700 px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {place.brand_source && (
               <div>
                <h4 className="font-bold mb-2">Sourcing</h4>
                <p className="text-sm text-gray-600">
                  Serving <span className="font-semibold text-black">{place.brand_source}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Action Card */}
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 sticky top-10">
            <h3 className="font-bold text-gray-900 mb-4">Location</h3>
            <p className="text-gray-600 mb-6">{place.address}</p>
            
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
            >
              Get Directions ↗
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
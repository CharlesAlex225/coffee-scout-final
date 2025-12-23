import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import MapWrapper from "@/components/MapWrapper";
import PlaceList from "@/components/PlaceList";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Force dynamic so we always see new shops
export const revalidate = 0;

export default async function Home() {
  const { data: places } = await supabase.from("places").select("*");

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-white border-b border-gray-100">
        <h1 className="text-5xl font-extrabold text-neutral-900 tracking-tight mb-4">
          Cacao. Tea. <span className="text-orange-600">Coffee.</span>
        </h1>
        <p className="text-lg text-neutral-600 max-w-xl mx-auto mb-8">
          A curated scout guide to the capital's best roasters, quietest tea rooms, and richest chocolates.
        </p>

        {/* 👇 THIS IS THE BUTTON SECTION WE MISSED */}
        <div className="flex justify-center gap-4">
           <Link href="/login" className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-full hover:bg-neutral-800 transition">
             🔑 Login / Sign Up
           </Link>
           <button className="px-6 py-3 bg-white border border-gray-200 text-neutral-900 font-medium rounded-full hover:bg-gray-50 transition">
             ☕ Find Coffee
           </button>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <div className="mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">NEW</span>
          <h2 className="text-xl font-bold text-gray-800">Scout Map</h2>
        </div>
        <MapWrapper places={places || []} />
      </section>

      {/* Grid List Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-neutral-800">The Curated List</h2>
        
        {/* We pass the data to the smart component */}
        <PlaceList places={places || []} />
        
      </section>
    </main>
  );
}
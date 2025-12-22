import { supabase } from "@/lib/supabase";
import PlaceFeed from "@/components/PlaceFeed";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default async function Home() {
  // UPDATED: Added 'slug' to the select list
  const { data: places, error } = await supabase
    .from("places")
    .select("id,slug,name,category,address,editorial_summary,vibe_tags")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load places: ${error.message}`);
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100">
      <Hero />
      <main className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <PlaceFeed places={places || []} />
      </main>
      <Footer />
    </div>
  );
}
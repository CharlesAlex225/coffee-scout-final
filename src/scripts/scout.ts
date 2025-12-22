import { supabaseAdmin } from '../lib/supabase-admin';

async function runScout() {
  console.log("Scout is seeding the 'Flagship 5' Ottawa venues...");

  const flagshipShops = [
    {
      name: "Arlington Five",
      slug: "arlington-five",
      category: "coffee",
      address: "5 Arlington Ave, Ottawa, ON K2P 1C1",
      editorial_summary: "A neighborhood staple known for its cozy, eclectic vibe and serious coffee program. The perfect spot for a slow morning.",
      vibe_tags: ["cozy", "eclectic", "relaxed"],
      specialties: ["Espresso", "Pastries"],
      amenities: ["Patio", "Seating"],
      dietary: ["Oat Milk", "Vegan Options"],
      brand_source: "Little Victories Coffee"
    },
    {
      name: "Little Victories Coffee",
      slug: "little-victories-glebe",
      category: "coffee",
      address: "439 Bank St, Ottawa, ON K2P 1Y7",
      editorial_summary: "A beautiful, minimalist space dedicated to precision roasting. The coffee here is bright, clean, and expertly prepared.",
      vibe_tags: ["minimalist", "modern", "focused"],
      specialties: ["Single-origin Espresso", "Pour-over"],
      amenities: ["Seating", "No Wifi"], 
      dietary: ["Oat Milk"],
      brand_source: "Little Victories"
    },
    {
      name: "Happy Goat Coffee Co.",
      slug: "happy-goat-laurel",
      category: "coffee",
      address: "35 Laurel St, Ottawa, ON K1Y 4M4",
      editorial_summary: "Social, unpretentious, and community-focused. A great reliable spot for meeting friends or grabbing a quick reliable brew.",
      vibe_tags: ["social", "casual", "bustling"],
      specialties: ["Seasonal Lattes", "Batch Brew"],
      amenities: ["Wifi", "Patio", "Large Seating"],
      dietary: ["Oat Milk", "Soy Milk", "Almond Milk"],
      brand_source: "Happy Goat"
    },
    {
      name: "Equator Coffee",
      slug: "equator-nac",
      category: "coffee",
      address: "1 Elgin St, Ottawa, ON K1P 5W1",
      editorial_summary: "Located inside the National Arts Centre, this spot feels professional and bright. Ideal for a business coffee or pre-show meet.",
      vibe_tags: ["professional", "bright", "spacious"],
      specialties: ["Fair Trade Coffee", "Espresso"],
      amenities: ["Wifi", "Work Tables", "Accessible"],
      dietary: ["Oat Milk", "Light Food"],
      brand_source: "Equator Coffee Roasters"
    },
    {
      name: "Union Street Kitchen Café",
      slug: "union-street-kitchen",
      category: "coffee",
      address: "42 Crichton St, Ottawa, ON K1M 1V4",
      editorial_summary: "A hidden gem in New Edinburgh. Extremely quiet, safe, and comforting with a focus on simple quality.",
      vibe_tags: ["quiet", "hidden gem", "cozy"],
      specialties: ["Cookie", "Espresso"],
      amenities: ["Seating", "Quiet Atmosphere"],
      dietary: ["Oat Milk"],
      brand_source: "Local Roasters"
    }
  ];

  const { error } = await supabaseAdmin
    .from("places")
    .upsert(flagshipShops, { onConflict: "slug" });

  if (error) console.error("Scout error:", error.message);
  else console.log("Success! The Flagship 5 have been seeded into the database.");
}

runScout();
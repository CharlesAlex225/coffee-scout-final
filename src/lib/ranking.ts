export function calculateWorkScore(place: any) {
  let score = 0;
  const amenities = Array.isArray(place.amenities) ? place.amenities : [];
  const vibes = Array.isArray(place.vibe_tags) ? place.vibe_tags : [];

  // Work Criteria
  if (amenities.includes("Wifi")) score += 4;
  else if (amenities.includes("No Wifi")) return 0; 

  if (amenities.includes("Work Tables")) score += 3;
  else if (amenities.includes("Large Seating") || amenities.includes("Seating")) score += 1;

  const focusVibes = ["quiet", "professional", "focused", "cozy"];
  const distractionVibes = ["bustling", "social", "loud"];

  if (vibes.some((t: string) => focusVibes.includes(t))) score += 3;
  if (vibes.some((t: string) => distractionVibes.includes(t))) score -= 1;

  return Math.max(0, Math.min(10, score));
}

export function calculateDateScore(place: any) {
  let score = 0;
  const amenities = Array.isArray(place.amenities) ? place.amenities : [];
  const vibes = Array.isArray(place.vibe_tags) ? place.vibe_tags : [];

  // CRITERIA 1: Atmosphere (Crucial for dates)
  const romanticVibes = ["cozy", "intimate", "dim", "quiet", "eclectic", "warm"];
  const killVibes = ["bright", "clinical", "loud", "professional"];

  // Bonus for every romantic vibe tag
  vibes.forEach((tag: string) => {
    if (romanticVibes.includes(tag.toLowerCase())) score += 2;
  });

  // CRITERIA 2: Comfort
  if (amenities.includes("Comfy Seating") || amenities.includes("Booths")) score += 3;
  if (place.category === "cacao" || place.category === "tea") score += 2; // Chocolate/Tea is inherently more romantic

  // CRITERIA 3: Deal Breakers
  if (killVibes.some((t) => vibes.includes(t))) score -= 3;
  if (amenities.includes("Work Tables")) score -= 2; // "Work" vibes kill romance

  // Cap score between 0 and 10
  return Math.max(0, Math.min(10, score));
}
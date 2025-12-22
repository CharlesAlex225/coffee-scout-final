export function calculateWorkScore(place: any) {
  let score = 0;
  
  // DEFENSIVE FIX: Force these to be arrays. 
  // If the DB sends null, we use an empty list [] instead of crashing.
  const amenities = Array.isArray(place.amenities) ? place.amenities : [];
  const vibes = Array.isArray(place.vibe_tags) ? place.vibe_tags : [];

  // CRITERIA 1: Connectivity (The most important)
  if (amenities.includes("Wifi")) {
    score += 4;
  } else if (amenities.includes("No Wifi")) {
    score = 0; // Immediate failure for deep work
    return 0; 
  }

  // CRITERIA 2: Workspace Comfort
  if (amenities.includes("Work Tables")) {
    score += 3;
  } else if (amenities.includes("Large Seating") || amenities.includes("Seating")) {
    score += 1;
  }

  // CRITERIA 3: Vibe (Focus vs. Chaos)
  const focusVibes = ["quiet", "professional", "focused", "cozy"];
  const distractionVibes = ["bustling", "social", "loud"];

  if (vibes.some((t: string) => focusVibes.includes(t))) score += 3;
  if (vibes.some((t: string) => distractionVibes.includes(t))) score -= 1;

  // Cap score between 0 and 10
  return Math.max(0, Math.min(10, score));
}
"use client";

import dynamic from "next/dynamic";

// This loads the map ONLY on the client side
const PlaceMap = dynamic(() => import("./PlaceMap"), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-2xl" />
});

export default function MapWrapper({ places }: { places: any[] }) {
  return <PlaceMap places={places} />;
}
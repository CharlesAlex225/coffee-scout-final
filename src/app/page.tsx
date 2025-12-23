"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PlaceList from "@/components/PlaceList";
// 👇 CHANGE 1: Import MapWrapper instead of PlaceMap
import MapWrapper from "@/components/MapWrapper"; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <h1 className="font-extrabold text-xl tracking-tight">Coffee Scout</h1>
          </div>

          <div className="flex gap-3">
            {!user ? (
              <Link href="/login" className="bg-black text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition">
                🔑 Login
              </Link>
            ) : (
              <Link href="/profile" className="flex items-center gap-2 bg-gray-100 border border-gray-200 text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
                    {user.email[0].toUpperCase()}
                </div>
                My Profile
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <input 
                    type="text" 
                    placeholder="Search cafes..." 
                    className="p-3 border rounded-xl w-full md:w-64 bg-gray-50"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <button onClick={() => setCategory("all")} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${category === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>All Spots</button>
                    <button onClick={() => setCategory("coffee")} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${category === "coffee" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>☕ Coffee</button>
                    <button onClick={() => setCategory("tea")} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${category === "tea" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>🍵 Tea</button>
                    <button onClick={() => setCategory("cacao")} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${category === "cacao" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>🍫 Cacao</button>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setView("grid")} className={`px-4 py-2 rounded-md text-sm font-bold transition ${view === "grid" ? "bg-white shadow-sm" : "text-gray-500"}`}>Grid</button>
                    <button onClick={() => setView("map")} className={`px-4 py-2 rounded-md text-sm font-bold transition ${view === "map" ? "bg-white shadow-sm" : "text-gray-500"}`}>Map</button>
                </div>
            </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {view === "grid" ? (
            <PlaceList search={search} category={category} />
        ) : (
            <div className="h-[600px] rounded-3xl overflow-hidden shadow-xl border border-gray-200 relative">
                {/* 👇 CHANGE 2: Use MapWrapper here */}
                <MapWrapper />
            </div>
        )}
      </main>
    </div>
  );
}
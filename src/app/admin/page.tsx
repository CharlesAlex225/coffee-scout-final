"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // 👇 REPLACE THIS WITH YOUR EMAIL 👇
  const MY_ADMIN_EMAIL = "charlesalexkoudou@gmail.com"; 

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email === MY_ADMIN_EMAIL) {
        setAuthorized(true);
      } else {
        router.push("/");
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const [formData, setFormData] = useState({
    name: "",
    category: "coffee",
    description: "",
    lat: "",
    long: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Saving...");

    const slug = formData.name.toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]/g, "");

    const { error } = await supabase.from("places").insert([
      {
        name: formData.name,
        slug: slug,
        category: formData.category,
        description: formData.description,
        lat: parseFloat(formData.lat),
        long: parseFloat(formData.long),
      },
    ]);

    if (error) {
      setStatus("Error: " + error.message);
    } else {
      setStatus("✅ Success! Spot added to the map.");
      setFormData({ name: "", category: "coffee", description: "", lat: "", long: "" });
    }
  };

  if (loading) return <div className="p-10 text-center">Checking ID...</div>;
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full h-fit">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Add New Spot 🛠️</h1>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Back Home</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
              <input name="name" required value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg bg-white">
                <option value="coffee">Coffee Shop</option>
                <option value="tea">Tea House</option>
                <option value="cacao">Chocolatier</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Latitude</label>
              <input name="lat" required value={formData.lat} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Longitude</label>
              <input name="long" required value={formData.long} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg" />
            </div>
          </div>
          <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition shadow-lg">
            Add to Map 🌍
          </button>
        </form>

        {status && (
          <div className={`mt-4 p-4 rounded-lg font-medium text-center ${status.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
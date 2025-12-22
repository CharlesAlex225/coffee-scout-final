export default function Hero() {
  return (
    <section className="relative py-20 px-6 text-center bg-[#FDFBF7]">
      {/* Decorative background element */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-2xl mx-auto space-y-6">
        <div className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-orange-800 uppercase bg-orange-100 rounded-full mb-4">
          Ottawa, Ontario
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Cacao. Tea. <span className="text-gray-400">Coffee.</span>
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed font-light">
          A curated scout guide to the capital's best roasters, 
          quietest tea rooms, and richest chocolate.
        </p>

        {/* A simple 'Call to Action' button */}
        <div className="pt-4">
          <a
            href="mailto:hello@cacaoteacoffee.com?subject=New Recommendation"
            className="inline-flex items-center text-sm font-semibold text-gray-900 border-b-2 border-black hover:text-orange-600 hover:border-orange-600 transition-all pb-0.5"
          >
            Know a spot we missed? Suggest it →
          </a>
        </div>
      </div>
    </section>
  );
}
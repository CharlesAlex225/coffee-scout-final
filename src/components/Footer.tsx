export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg tracking-tight">Cacao Tea Coffee.</h3>
          <p className="text-sm text-gray-500 mt-1">
            © {new Date().getFullYear()} Ottawa Scout.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-black transition-colors">About</a>
          <a href="#" className="hover:text-black transition-colors">Manifesto</a>
          <a href="https://github.com" target="_blank" className="hover:text-black transition-colors">Open Source</a>
        </div>
      </div>
    </footer>
  );
}
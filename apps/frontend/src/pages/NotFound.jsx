// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gray-100/80 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gray-100/80 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gray-100 rounded-full" />
      <div className="absolute bottom-1/3 left-1/5 w-10 h-10 bg-gray-200/60 rounded-full" />

      <div className="text-center max-w-lg relative z-10">
        {/* Logo */}
        <Link to="/" className="inline-block mb-10">
          <span className="text-sm font-extrabold text-gray-300 tracking-[3px] uppercase">Notervo</span>
        </Link>

        {/* 404 number */}
        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[160px] font-extrabold text-gray-100 leading-none tracking-tight select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Page Not Found
              </h2>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto">
          Sorry, the page you&#39;re looking for doesn&#39;t exist or has been moved to a different location.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-black transition-all duration-200 shadow-lg shadow-primary/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Go Back Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:border-primary hover:text-primary transition-all duration-200"
          >
            Browse Shop
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Subtle help text */}
        <p className="text-[11px] text-gray-400 mt-10">
          If you believe this is an error, please{" "}
          <Link to="/contact" className="text-gray-500 underline underline-offset-2 hover:text-primary transition-colors">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default NotFound;
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Map, CalendarDays, MapPin, ChevronRight, ChevronLeft, BrainCircuit, Zap } from 'lucide-react';
import Footer from '../components/Footer';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';

// Hero background & destination card images (all from local assets)
import heroBg from '../assets/mainBG.avif';
import card1Img from '../assets/cherry-blossoms-spring.avif';
import card2Img from '../assets/m_Bali_tv_destination_img_1_l_771_1158.webp';
import card3Img from '../assets/3 giorni a Parigi Tour Eiffel.avif';
import card4Img from '../assets/india-four-great-cities.webp';

const DESTINATIONS = [
  { img: card1Img, name: 'Tokyo', location: 'Japan' },
  { img: card2Img, name: 'Bali', location: 'Indonesia' },
  { img: card3Img, name: 'Paris', location: 'France' },
  { img: card4Img, name: 'Mumbai', location: 'India' }
];

const LandingPage = () => {
  const { user } = useAuth();
  const [swapped, setSwapped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    if (currentIndex < DESTINATIONS.length - 1) setCurrentIndex(prev => prev + 1);
  };
  const prevCard = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="relative w-full h-screen min-h-[640px] overflow-hidden flex flex-col">

        {/* Background image */}
        <img
          src={heroBg}
          alt="Scenic travel background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* ── NAVBAR (Inner Hero) ────────────────────────────────────────── */}
        <nav className="relative z-20 flex items-center justify-between px-8 lg:px-16 pt-7">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 text-white mt-2 group">
            <img src="/intellilogo.png" alt="IntelliTour Logo" className="h-10 w-auto drop-shadow-md scale-[1.35] origin-left transition-transform group-hover:scale-[1.4]" />
            <div className="flex flex-col justify-center ml-2">
              <span className="text-3xl font-black tracking-tight leading-none drop-shadow-md">IntelliTour</span>
              <span className="text-[0.65rem] font-bold tracking-[0.25em] text-white/90 mt-1 uppercase leading-none drop-shadow-sm">AI Powered, Itinerary Builder</span>
            </div>
          </Link>

          {/* Center nav links — hidden on mobile */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-white/75">
            <li><a href="#destinations" className="hover:text-white transition-colors">Destinations</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center border border-white/60 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-white/10 transition-all"
            >
              Sign up
            </Link>
          </div>
        </nav>

        {/* Separator Line */}
        <div className="relative z-20 w-full border-b border-white/20 mt-4 shadow-sm" />

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex items-center px-8 lg:px-16 pb-28 pt-16">

          {/* Left: headline + CTA */}
          <div className="flex-1 max-w-lg">

            {/* Location tag */}
            <div className="flex items-center gap-1 text-white/60 text-xs font-semibold tracking-widest uppercase mb-5">
              <MapPin className="h-3.5 w-3.5" />
              Smart. Explore. Connect.
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Dream Destination<br />Without the Hassle
            </h1>

            {/* Subtext */}
            <p className="text-white/90 text-lg font-medium leading-relaxed max-w-lg mb-8 drop-shadow-md">
              Plan your perfect trip with our intelligent itinerary builder. From flights to hotels, we've got every detail covered.
            </p>

            {/* CTA */}
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-slate-900 text-sm font-bold px-7 py-3.5 rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              Let's Go
            </Link>
          </div>

          {/* Right: destination cards — Carousel implementation */}

          {/* New Interactive Carousel */}
          <div className="hidden md:flex flex-col items-center justify-center flex-1 relative w-full overflow-hidden select-none">

            {/* Carousel Track Wrapper */}
            <div className="w-full overflow-x-hidden py-4">
              <div
                className="flex items-center gap-4 transition-transform duration-500 ease-in-out w-max"
                style={{ transform: `translateX(calc(50% - 104px - ${currentIndex * 224}px))` }}
              >
                {DESTINATIONS.map((dest, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={idx}
                      className={`relative w-52 h-72 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl transition-all duration-500 ease-in-out ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-50 z-0'
                        }`}
                    >
                      <img src={dest.img} alt={dest.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                          <MapPin className="h-3 w-3" />
                          <span>{dest.name}</span>
                          <span className="text-white/60">· {dest.location}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex flex-col items-center gap-4 mt-6">

              {/* Navigation Arrows */}
              <div className="flex items-center gap-6">
                <button
                  aria-label="Previous destination"
                  onClick={prevCard}
                  disabled={currentIndex === 0}
                  className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all ${currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/40'
                    }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Next destination"
                  onClick={nextCard}
                  disabled={currentIndex === DESTINATIONS.length - 1}
                  className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all ${currentIndex === DESTINATIONS.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/40'
                    }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Dot Indicators */}
              <div className="flex items-center gap-2">
                {DESTINATIONS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Previous cards code disabled (commented via false evaluation to avoid nested comment JSX errors) */}
          {false && (
            <div className="hidden lg:flex items-center justify-center flex-1 relative h-80 select-none">

              {/* Card wrapper to maintain dimensions in flex */}
              <div className="relative w-56 h-72">

                {/* Card 2 (Bali) */}
                <div
                  className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer ${swapped ? 'z-20' : 'z-10'
                    }`}
                  style={{
                    transform: swapped
                      ? 'rotate(-2deg) translateX(0) scale(1)'
                      : 'rotate(4deg) translateX(80px) translateY(10px) scale(0.95)',
                  }}
                  onClick={() => setSwapped(true)}
                >
                  <img src={card2Img} alt="Bali" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                      <MapPin className="h-3 w-3" />
                      <span>Bali</span>
                      <span className="text-white/60">· Indonesia</span>
                    </div>
                  </div>
                </div>

                {/* Card 1 (Kyoto) */}
                <div
                  className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer ${!swapped ? 'z-20' : 'z-10'
                    }`}
                  style={{
                    transform: !swapped
                      ? 'rotate(-2deg) translateX(0) scale(1)'
                      : 'rotate(4deg) translateX(80px) translateY(10px) scale(0.95)',
                  }}
                  onClick={() => setSwapped(false)}
                >
                  <img src={card1Img} alt="Kyoto" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                      <MapPin className="h-3 w-3" />
                      <span>Kyoto</span>
                      <span className="text-white/60">· Japan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation arrow */}
              <button
                aria-label="Next destination"
                className="absolute z-30 h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110 active:scale-95"
                style={{ right: '28%', top: '50%', transform: 'translateY(-50%)' }}
                onClick={() => setSwapped(!swapped)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>


        {/* Social links */}
        <div className="hidden sm:flex items-center gap-4 text-white/40 text-xs font-medium tracking-widest">
          <a href="#" className="hover:text-white/70 transition-colors">ig</a>
          <a href="#" className="hover:text-white/70 transition-colors">fb</a>
          <a href="#" className="hover:text-white/70 transition-colors">tw</a>
          <a href="#" className="hover:text-white/70 transition-colors">in</a>
        </div>

      </section>

      <FeaturesSection />

      <AboutSection />

      <Footer />

    </div>
  );
};

export default LandingPage;

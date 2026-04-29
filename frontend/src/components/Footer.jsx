import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-16 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.07] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand & Description */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3 group">
              <img
                src="/intellilogo.png"
                alt="IntelliTour Logo"
                className="h-10 w-auto scale-[1.35] origin-left filter brightness-0 invert opacity-90 transition-transform group-hover:scale-[1.4]"
              />
              <div className="flex flex-col justify-center ml-1 text-left">
                <span className="text-2xl font-black tracking-tight leading-none text-white">IntelliTour</span>
                <span className="text-[0.55rem] font-bold tracking-[0.25em] text-slate-400 mt-1 uppercase leading-none">AI Itinerary Builder</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Revolutionizing the way you travel. Experience personalized, AI-driven itineraries crafted in seconds so you can focus on the adventure.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#destinations" className="text-sm hover:text-brand-400 transition-colors">Destinations</a></li>
              <li><a href="#features" className="text-sm hover:text-brand-400 transition-colors">Core Features</a></li>
              <li><a href="#about" className="text-sm hover:text-brand-400 transition-colors">Our Mission</a></li>
              <li><Link to="/pricing" className="text-sm hover:text-brand-400 transition-colors">Pricing Plans</Link></li>
              <li><Link to="/register" className="text-sm hover:text-brand-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-6">Legal & Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-6">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <a href="mailto:support@intellitour.com" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">support@intellitour.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Phone</p>
                  <a href="tel:+18001234567" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">+1 (800) 123-4567</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Office</p>
                  <span className="text-sm text-slate-400 block mt-0.5">123 Innovation Drive<br />Tech District, SF 94105</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} IntelliTour. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

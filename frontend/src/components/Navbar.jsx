import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LogOut, User, Map, Plus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 text-slate-900 hover:opacity-80 transition-opacity mt-1 group">
            <img
              src="/intellilogo.png"
              alt="IntelliTour Logo"
              className="h-8 w-auto scale-[1.35] origin-left transition-transform group-hover:scale-[1.4]"
            />
            <div className="flex flex-col justify-center ml-1">
              <span className="text-xl font-black tracking-tight leading-none text-brand-600">IntelliTour</span>
              <span className="text-[0.5rem] font-bold tracking-[0.25em] text-slate-500 mt-1 uppercase leading-none">AI Powered, Itinerary Builder</span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/pricing"
                  className="hidden sm:flex items-center text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-2 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/trip/new"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-2 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" /> New Trip
                </Link>
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-2 rounded-md transition-colors"
                >
                  <Map className="h-4 w-4" /> My Trips
                </Link>

                <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-3 pr-4 py-1.5 shadow-sm">
                  <div className="h-6 w-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    {user.name.split(' ')[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 px-3 py-2 rounded-md transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>

                {/* Mobile Logout Icon */}
                <button
                  onClick={handleLogout}
                  className="sm:hidden p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-2 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-500 shadow-sm transition-all active:scale-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

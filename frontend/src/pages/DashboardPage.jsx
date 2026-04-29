import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, Calendar, MapPin, Plus, Loader2, Compass } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const DashboardPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips/history');
        setTrips(res.data.trips);
      } catch (err) {
        toast.error('Failed to load your trips.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center bg-slate-50">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-[calc(100vh-4rem)] py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header section */}
        <div className="md:flex md:items-center md:justify-between mb-10">
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-bold leading-7 text-slate-900 sm:truncate sm:text-4xl sm:tracking-tight flex items-center gap-3">
              <Map className="h-8 w-8 text-brand-600" />
              My Trips
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Your personal library of AI-crafted adventures.
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              to="/trip/new"
              className="inline-flex items-center gap-x-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 hover:shadow-brand-500/25 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 active:scale-95"
            >
              <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              New Trip
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {!loading && trips.length === 0 && (
          <div className="bg-white/60 backdrop-blur-md text-center rounded-3xl border-2 border-dashed border-slate-300/60 px-6 py-24 hover:border-brand-300 hover:bg-white/80 transition-all shadow-sm">
            <Compass className="mx-auto h-16 w-16 text-slate-300" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-semibold text-slate-900">No trips planned yet</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
              Get started by generating your first AI-powered travel itinerary. It only takes a few seconds!
            </p>
            <div className="mt-8">
              <Link
                to="/trip/new"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-yellow-300" /> Plan Your First Trip
              </Link>
            </div>
          </div>
        )}

        {/* Grid of Trip Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <Link 
              key={trip._id} 
              to={`/trip/${trip._id}`}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
            >
              {/* Card Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                <img 
                  src={(trip.coverImage && !trip.coverImage.includes('source.unsplash.com') && !trip.coverImage.includes('pollinations.ai') && !trip.coverImage.includes('loremflickr')) ? trip.coverImage : `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trips/image/${encodeURIComponent(trip.destination)}`} 
                  alt={trip.destination} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Prevent infinite loop
                    e.currentTarget.src = `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Badges overlaid on image */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h3 className="text-xl font-bold text-white drop-shadow-md line-clamp-1">
                    {trip.destination}
                  </h3>
                  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/30">
                    {trip.days} Days
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-slate-600 line-clamp-2 md:line-clamp-3">
                    {trip.tripSummary || `An AI-planned ${trip.days}-day adventure exploring the best of ${trip.destination}.`}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-brand-500" />
                    <span>{new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                  </div>
                  <div className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {trip.budgetFormatted} {/* Uses the virtual field from Mongoose */}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

// Re-importing inline to fix Sparkles dependency above
import { Sparkles } from 'lucide-react';

export default DashboardPage;

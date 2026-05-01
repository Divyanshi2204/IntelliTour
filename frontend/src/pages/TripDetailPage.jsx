import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, DollarSign, Clock, ArrowLeft,
  Utensils, Camera, Map, Bus, Home, Info, Loader2, Trash2,
  Download, Sparkles, Luggage, CloudSun,
} from 'lucide-react';
import { Sparkles as SparklesIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import cherryBlossomsImg from '../assets/cherry-blossoms-spring.avif';
import PackingListTab from '../components/PackingListTab';
import BudgetTab from '../components/BudgetTab';
import WeatherTab from '../components/WeatherTab';
import ExpertModal from '../components/ExpertModal';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);
const TabSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-20" /> <Skeleton className="h-6 w-24" /> <Skeleton className="h-6 w-16" />
        </div>
      </div>
    ))}
  </div>
);

// ── Category icon (timeline) ──────────────────────────────────────────────────
const getCategoryIcon = (cat) => {
  const cls = 'h-5 w-5';
  switch (cat) {
    case 'food': return <Utensils className={`${cls} text-orange-500`} />;
    case 'sightseeing': return <Camera className={`${cls} text-blue-500`} />;
    case 'adventure': return <Map className={`${cls} text-green-500`} />;
    case 'transport': return <Bus className={`${cls} text-slate-500`} />;
    case 'accommodation': return <Home className={`${cls} text-indigo-500`} />;
    default: return <Info className={`${cls} text-slate-400`} />;
  }
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'timeline', label: 'Timeline', Icon: Map },
  { id: 'packing', label: 'Packing List', Icon: Luggage },
  { id: 'budget', label: 'Budget', Icon: DollarSign },
  { id: 'weather', label: 'Weather', Icon: CloudSun },
];

// ── Main component ────────────────────────────────────────────────────────────
const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [showExpert, setShowExpert] = useState(false);

  // per-tab lazy state: { data, loading, loaded }
  const [tabState, setTabState] = useState({
    packing: { data: null, loading: false, loaded: false },
    budget: { data: null, loading: false, loaded: false },
    weather: { data: null, loading: false, loaded: false },
  });

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then((res) => setTrip(res.data.trip))
      .catch(() => toast.error('Failed to load trip details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    setIsDeleting(true);
    try {
      await api.delete(`/trips/${id}`);
      toast.success('Trip deleted successfully');
      navigate('/dashboard');

    } catch {
      toast.error('Failed to delete trip');
      setIsDeleting(false);
    }
  };

  const handleTabClick = async (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'timeline' || tabState[tabId]?.loaded) return;

    setTabState((prev) => ({ ...prev, [tabId]: { ...prev[tabId], loading: true } }));

    const month = new Date().toLocaleString('default', { month: 'long' });
    const activities = [...new Set(
      trip.itinerary?.flatMap((d) => d.activities.map((a) => a.category)) ?? []
    )];

    try {
      let res;
      if (tabId === 'packing') {
        res = await api.post('/travel/packing-list', {
          destination: trip.destination, month, activities, days: trip.days,
        });
      } else if (tabId === 'budget') {
        res = await api.post('/travel/cost-estimate', {
          destination: trip.destination, days: trip.days,
          companions: 1, budget: trip.budgetLevel,
        });
      } else if (tabId === 'weather') {
        res = await api.post('/travel/weather', {
          destination: trip.destination, month,
        });
      }
      setTabState((prev) => ({
        ...prev,
        [tabId]: { data: res.data.data, loading: false, loaded: true },
      }));
    } catch {
      toast.error(`Failed to load ${tabId} data`);
      setTabState((prev) => ({ ...prev, [tabId]: { ...prev[tabId], loading: false } }));
    }
  };

  // ── Loading / not-found guards ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center bg-slate-50">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
      </div>
    );
  }
  if (!trip) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Trip not found</h2>
          <Link to="/dashboard" className="text-brand-600 hover:text-brand-500 mt-4 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const ts = tabState[activeTab] ?? {};

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] pb-28">

      {/* Hero */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900">
        <img src={cherryBlossomsImg} alt={trip.destination}
          className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex justify-between items-start mb-4 print:hidden">
            <Link to="/dashboard" className="inline-flex items-center text-slate-300 hover:text-white text-sm font-medium transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to My Trips
            </Link>
            <div className="flex items-center gap-3">
              <button onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-brand-500/80 hover:bg-brand-500 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium transition-all">
                <Download className="h-4 w-4" /> Export PDF
              </button>
              <button onClick={handleDelete} disabled={isDeleting}
                className="inline-flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium transition-all">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete Trip
              </button>
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-md mb-2">{trip.destination}</h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-200 text-sm sm:text-base font-medium">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4 text-brand-300" /> {trip.days} Days
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
              <DollarSign className="h-4 w-4 text-emerald-400" /> {trip.budgetFormatted} ({trip.budgetLevel})
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">

        {/* Tab bar */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-1.5 mb-6 flex gap-1 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* ── TIMELINE TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'timeline' && (
          <>
            {trip.tripSummary && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-10">
                <h2 className="text-lg font-bold text-slate-900 mb-2">AI Trip Synthesis</h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{trip.tripSummary}</p>
              </div>
            )}
            <div className="space-y-12">
              {trip.itinerary?.map((day, dIdx) => (
                <div key={`day-${day.day}`} className="relative pl-4 sm:pl-0">
                  <div className="sticky top-16 z-30 sm:relative sm:top-0 bg-slate-50/95 backdrop-blur py-4 sm:bg-transparent sm:py-0 border-b sm:border-0 border-slate-200 mb-6 sm:mb-8 -ml-4 sm:ml-0 px-4 sm:px-0">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Day {day.day}</h2>
                      <span className="text-lg sm:text-xl font-medium text-slate-500 truncate">— {day.title}</span>
                    </div>
                    {day.dailySummary && (
                      <p className="mt-2 text-sm text-slate-600 max-w-3xl">{day.dailySummary}</p>
                    )}
                  </div>
                  <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
                    {day.activities.map((activity, aIdx) => (
                      <div key={`act-${dIdx}-${aIdx}`} className="relative pl-8 sm:pl-10">
                        <div className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full bg-white border-[3px] border-brand-500 shadow-sm" />
                        <div className="group bg-white rounded-xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all p-5">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-50 rounded-lg">{getCategoryIcon(activity.category)}</div>
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                                {activity.title}
                              </h3>
                            </div>
                            <div className="flex items-center text-sm font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md shrink-0 w-fit">
                              <Clock className="h-4 w-4 mr-1.5" /> {activity.time}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed mb-4">{activity.description}</p>
                          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-50">
                            {activity.location && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <MapPin className="h-3.5 w-3.5" /> {activity.location}
                              </div>
                            )}
                            {activity.estimatedCost && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                <DollarSign className="h-3.5 w-3.5" /> {activity.estimatedCost}
                              </div>
                            )}
                          </div>
                          {activity.tips && (
                            <div className="mt-4 flex items-start gap-2 bg-amber-50 text-amber-800 p-3 rounded-lg text-sm">
                              <Sparkles className="h-5 w-5 shrink-0 text-amber-500" />
                              <p><span className="font-semibold">Pro Tip: </span>{activity.tips}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── LAZY TABS (Packing / Budget / Weather) ──────────────────────── */}
        {activeTab !== 'timeline' && (
          <div className="pb-4">
            {ts.loading && <TabSkeleton />}
            {!ts.loading && !ts.loaded && (
              <div className="text-center py-20 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-brand-400" />
                <p className="text-sm">Loading…</p>
              </div>
            )}
            {ts.loaded && activeTab === 'packing' && <PackingListTab data={ts.data} />}
            {ts.loaded && activeTab === 'budget' && <BudgetTab data={ts.data} />}
            {ts.loaded && activeTab === 'weather' && <WeatherTab data={ts.data} />}
          </div>
        )}
      </div>

      {/* Floating Expert Button */}
      <button
        onClick={() => setShowExpert(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-2xl shadow-xl shadow-brand-500/30 transition-all hover:scale-105 active:scale-95 font-semibold text-sm"
        aria-label="Ask Travel Expert"
      >
        <SparklesIcon className="h-5 w-5" /> Ask Expert
      </button>

      {/* Expert Modal */}
      {showExpert && <ExpertModal trip={trip} onClose={() => setShowExpert(false)} />}
    </div>
  );
};

export default TripDetailPage;

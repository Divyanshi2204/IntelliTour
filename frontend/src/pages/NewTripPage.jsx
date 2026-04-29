import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Sparkles, Loader2, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const NewTripPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsGenerating(true);

    // We expect the preferences text input to just be a single string for now.
    // E.g. "Nature, Food, Photography". We split it into an array for the backend.
    const preferencesArray = data.travelStyle
      ? data.travelStyle.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      destination: data.destination,
      days: parseInt(data.days, 10),
      budget: parseFloat(data.budget),
      currency: data.currency || 'USD',
      preferences: preferencesArray,
      budgetLevel: data.budgetLevel || 'moderate'
    };

    try {
      // Call our backend API which communicates with Gemini
      const res = await api.post('/trips/generate', payload);
      toast.success('Your perfect AI trip is ready!');
      // Navigate to the trip detail view (which we will build in Phase 5)
      navigate(`/trip/${res.data.trip._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate itinerary. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FAF9F6] flex flex-col items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* 
        Hero Section with Background Image 
      */}
      <div className="w-full relative h-[60vh] min-h-[400px]">
        {/* Absolute Background Image Layer */}
        <div
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            backgroundImage: "url('https://media.istockphoto.com/id/698902340/photo/world-landmarks-photo-collage-on-vintage-tes-sepia-textured-background-travel-tourism-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=EwwWJ-yBDB0zcPkOfbvrfaSKy0BfwVwWouAX03iDBag=')",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        ></div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20"></div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center pt-8">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl max-w-5xl drop-shadow-lg">Plan Your Perfect Trip in Seconds.</h2>
          <p className="mt-6 max-w-2xl text-lg text-slate-200 drop-shadow">
            Just tell us where you're going and what you love. Our AI handles the logistics, schedules, and costs—so you can focus on the adventure.
          </p>
        </div>
      </div>

      {/* 
        The Trip Generation Form (Overlapping the Hero)
      */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-24">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/80">

          <div className="bg-brand-50 px-8 py-5 border-b border-brand-100 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-brand-900 flex items-center gap-2">
              <MapPin className="text-brand-600 h-6 w-6" />
              Where to next?
            </h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Grid 1: Core Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Destination */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 font-sans mb-1.5" htmlFor="destination">
                    Destination
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="destination"
                      type="text"
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.destination ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition-all`}
                      placeholder="e.g. Kyoto, Japan or Amalfi Coast"
                      {...register('destination', { required: 'Destination is required' })}
                    />
                  </div>
                  {errors.destination && <p className="mt-1.5 text-sm text-red-600">{errors.destination.message}</p>}
                </div>

                {/* Number of Days */}
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="days">
                    Duration (Days)
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="days"
                      type="number"
                      min="1"
                      max="30"
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.days ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 bg-slate-50 focus:bg-white transition-all`}
                      placeholder="e.g. 5"
                      {...register('days', {
                        required: 'Required',
                        min: { value: 1, message: 'Minimum 1 day' },
                        max: { value: 30, message: 'Max 30 days for now' }
                      })}
                    />
                  </div>
                  {errors.days && <p className="mt-1.5 text-sm text-red-600">{errors.days.message}</p>}
                </div>
              </div>

              {/* Grid 2: Economics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Budget input with currency selector */}
                <div className="col-span-1 md:col-span-2 relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="budget">
                    Total Budget
                  </label>
                  <div className="relative flex rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="budget"
                      type="number"
                      min="0"
                      className={`block w-full pl-10 pr-3 py-3 border border-r-0 rounded-l-lg ${errors.budget ? 'border-red-300 ring-red-300' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 bg-slate-50 focus:bg-white transition-all`}
                      placeholder="Total allowed spend"
                      {...register('budget', { required: 'Budget is required' })}
                    />
                    <select
                      className="w-1/3 bg-slate-100 border border-slate-300 rounded-r-lg text-slate-700 font-medium py-3 px-3 focus:ring-2 focus:ring-brand-500 outline-none"
                      {...register('currency')}
                      defaultValue="USD"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                  {errors.budget && <p className="mt-1.5 text-sm text-red-600">{errors.budget.message}</p>}
                </div>

                {/* Budget Level */}
                <div className="col-span-1 border rounded-lg border-slate-200 bg-white p-1">
                  <label className="sr-only">Budget Style</label>
                  <div className="grid grid-cols-3 gap-1 h-full h-[48px] mt-[26px]">
                    {/* Hacky tab UI for radio buttons via react-hook-form */}
                    {['budget', 'moderate', 'luxury'].map((level) => (
                      <label
                        key={level}
                        className="cursor-pointer relative flex-1"
                      >
                        <input
                          type="radio"
                          value={level}
                          className="peer sr-only"
                          {...register('budgetLevel')}
                          defaultChecked={level === 'moderate'}
                        />
                        <div className="h-full flex items-center justify-center rounded-md font-medium text-xs sm:text-sm text-slate-500 transition-colors peer-checked:bg-slate-800 peer-checked:text-white hover:bg-slate-100 peer-checked:shadow-sm capitalize">
                          {level}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Travel Style / Preferences */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2" htmlFor="travelStyle">
                  <HeartHandshake className="h-4 w-4 text-brand-500" /> Travel Style & Preferences
                </label>
                <textarea
                  id="travelStyle"
                  rows="3"
                  className="block w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition-all resize-none shadow-sm"
                  placeholder="e.g. 'I love local food markets, modern art museums, and hiking. Prefer walking over taxis. Avoid crowded tourist traps.'"
                  {...register('travelStyle')}
                ></textarea>
                <p className="mt-2 text-xs text-slate-500">
                  Be as specific as you like! The AI will tailor the itinerary to these notes.
                </p>
              </div>

              {/* Submit Area */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="relative group inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white transition-all duration-300 bg-brand-600 rounded-full hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600 disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden shadow-lg hover:shadow-brand-500/30"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-96 ease"></span>

                  {isGenerating ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="relative">AI is crafting your itinerary...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 group-hover:scale-110 transition-transform" />
                      <span className="relative">Generate AI Travel Plan</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTripPage;

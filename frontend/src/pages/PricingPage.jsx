import { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-lg text-slate-600 mb-6 font-medium">
            We offer Basic, Plus and Pro Plans to match any travel length and budget. Choose the best plan for you and start planning your next trip today!
          </p>

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="bg-white border border-slate-200 rounded-full p-1 inline-flex shadow-sm">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  !isYearly 
                    ? 'bg-slate-100 text-slate-800 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  isYearly 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Yearly
              </button>
            </div>
            
            <div className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-md">
              Save 2 months free with yearly
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-end">
          
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col overflow-hidden h-full">
            <div className="bg-slate-600 py-4 text-center">
              <h3 className="text-xl font-bold text-white">Basic</h3>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-center mb-8">
                <span className="text-5xl font-extrabold text-slate-900">$0</span>
                <span className="text-sm font-medium text-slate-500 ml-1">/forever</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {['3 Itinerary generations / month', 'Up to 14-day itineraries', '1 Step-by-Step trip', 'Maps Integration', 'PDF Downloads', 'Standard support'].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-3 px-4 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-500 transition-colors">
                Sign Up Free
              </button>
            </div>
          </div>

          {/* Plus Plan */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-brand-500 flex flex-col overflow-hidden transform scale-100 md:scale-105 z-10 h-full relative">
            <div className="bg-brand-600 py-4 text-center">
              <h3 className="text-xl font-bold text-white">Plus</h3>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-center mb-8">
                <div className="flex justify-center items-end">
                  <span className="text-5xl font-extrabold text-slate-900">
                    ${isYearly ? '2.50' : '3.00'}
                  </span>
                  <span className="text-sm font-medium text-slate-500 ml-1 mb-1">/month</span>
                </div>
                {isYearly && (
                  <div className="mt-2 text-xs font-semibold">
                    <span className="line-through text-slate-400 mr-2">$36/yr</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Save $6</span>
                    <div className="text-slate-500 mt-1">Billed $30/year</div>
                  </div>
                )}
                {!isYearly && (
                  <div className="mt-2 text-xs font-medium text-slate-500 h-10 flex items-center justify-center">
                    Billed $3/month
                  </div>
                )}
              </div>
              
              <div className="text-sm font-semibold text-slate-800 mb-4">Everything in Basic Plan and</div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited Step-by-Step trips', 'Personalized packing lists', 'Additional itinerary details (hotels, transportation, travel requirements, local sayings, etc.)', 'Private Itineraries', 'Ad-free experience'].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-3 px-4 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                Sign In To Upgrade
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col overflow-hidden relative h-full mt-8 md:mt-0">
            {/* Best Value Badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-white text-xs font-bold px-4 py-1 rounded-full z-20 shadow-sm border border-amber-500">
              Best Value
            </div>
            
            <div className="bg-amber-500 py-4 text-center pt-6">
              <h3 className="text-xl font-bold text-white">Pro</h3>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-center mb-8">
                <div className="flex justify-center items-end">
                  <span className="text-5xl font-extrabold text-slate-900">
                    ${isYearly ? '4.17' : '5.00'}
                  </span>
                  <span className="text-sm font-medium text-slate-500 ml-1 mb-1">/month</span>
                </div>
                {isYearly && (
                  <div className="mt-2 text-xs font-semibold">
                    <span className="line-through text-slate-400 mr-2">$60/yr</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Save $10</span>
                    <div className="text-slate-500 mt-1">Billed $50/year</div>
                  </div>
                )}
                {!isYearly && (
                  <div className="mt-2 text-xs font-medium text-slate-500 h-10 flex items-center justify-center">
                    Billed $5/month
                  </div>
                )}
              </div>
              
              <div className="text-sm font-semibold text-slate-800 mb-4">Everything in Plus Plan and</div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Up to 30-Day Itineraries', 'Smartest AI with live search'].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-3 px-4 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                Sign In To Upgrade
              </button>
            </div>
          </div>

        </div>

        <div className="text-center mt-12 text-sm text-slate-500">
          Prices in USD. Local currency applied at checkout.
        </div>

      </div>
    </div>
  );
};

export default PricingPage;

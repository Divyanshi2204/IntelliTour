import { Home, Utensils, Bus, Camera, DollarSign, Lightbulb, Star, Info } from 'lucide-react';

const CATS = [
  { key: 'accommodation', label: 'Accommodation', Icon: Home,     color: 'text-indigo-500' },
  { key: 'food',          label: 'Food & Dining',  Icon: Utensils, color: 'text-orange-500' },
  { key: 'transport',     label: 'Transport',       Icon: Bus,      color: 'text-slate-500'  },
  { key: 'activities',    label: 'Activities',      Icon: Camera,   color: 'text-blue-500'   },
];

const BudgetTab = ({ data }) => {
  const bd = data.dailyBreakdown || {};
  const te = data.totalEstimate || {};
  const currency = data.currency || 'USD';

  return (
    <div className="space-y-5">
      {/* Total banner */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-500 rounded-2xl p-6 text-white shadow-lg shadow-brand-500/20">
        <p className="text-brand-100 text-sm mb-1">Total Estimate — {data.days} days</p>
        <p className="text-3xl font-black">
          {currency} {te.low?.toLocaleString() ?? '—'} &ndash; {te.high?.toLocaleString() ?? '—'}
        </p>
        <p className="text-brand-200 text-xs mt-1">per person</p>
      </div>

      {/* Daily cards */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Daily Breakdown</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {CATS.map(({ key, label, Icon, color }) => {
            const d = bd[key];
            if (!d) return null;
            return (
              <div key={key} className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="font-semibold text-slate-700 text-sm">{label}</span>
                </div>
                <p className="text-xl font-bold text-slate-900">
                  {currency} {d.low} &ndash; {d.high}
                  <span className="text-sm font-normal text-slate-400"> /day</span>
                </p>
                {d.note && <p className="text-xs text-slate-400 mt-1">{d.note}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      {data.tips?.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <h4 className="font-semibold text-emerald-800 text-sm mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4" /> Money-Saving Tips
          </h4>
          <ul className="space-y-1.5">
            {data.tips.map((tip, i) => (
              <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                <Star className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" /> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.note && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
          <Info className="h-4 w-4 shrink-0 mt-0.5" /><p>{data.note}</p>
        </div>
      )}
    </div>
  );
};

export default BudgetTab;

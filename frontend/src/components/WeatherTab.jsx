import { ThermometerSun, Droplets, Wind, CalendarDays, Info } from 'lucide-react';

const StatCard = ({ Icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
    <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="font-bold text-slate-900 text-sm leading-tight">{value}</p>
  </div>
);

const WeatherTab = ({ data }) => (
  <div className="space-y-4">
    {/* Stat row */}
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        Icon={ThermometerSun}
        label="Temperature"
        value={`${data.temperature?.min ?? '?'}–${data.temperature?.max ?? '?'}${data.temperature?.unit ?? '°C'}`}
        color="text-orange-500"
      />
      <StatCard Icon={Droplets} label="Rainfall"  value={data.rainfall  ?? '—'} color="text-blue-500"  />
      <StatCard Icon={Wind}     label="Humidity"  value={data.humidity  ?? '—'} color="text-slate-500" />
    </div>

    {/* Conditions */}
    {data.conditions && (
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
        <p className="text-sky-800 font-semibold text-sm mb-1">Conditions in {data.month}</p>
        <p className="text-sky-700 text-sm">{data.conditions}</p>
      </div>
    )}

    {/* What to expect */}
    {data.whatToExpect && (
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="font-bold text-slate-900 mb-2 text-sm">What to Expect</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{data.whatToExpect}</p>
      </div>
    )}

    {/* Best time */}
    {data.bestTimeToVisit && (
      <div className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-xl p-4">
        <CalendarDays className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-brand-700 text-sm">Best Time to Visit</p>
          <p className="text-brand-600 text-sm mt-0.5">{data.bestTimeToVisit}</p>
        </div>
      </div>
    )}

    {/* Packing tips for weather */}
    {data.packingTips?.length > 0 && (
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <p className="font-semibold text-slate-800 text-sm mb-2">Weather Packing Tips</p>
        <div className="flex flex-wrap gap-2">
          {data.packingTips.map((tip, i) => (
            <span key={i} className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
              {tip}
            </span>
          ))}
        </div>
      </div>
    )}

    {data.note && (
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
        <Info className="h-4 w-4 shrink-0 mt-0.5" /><p>{data.note}</p>
      </div>
    )}
  </div>
);

export default WeatherTab;

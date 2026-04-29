import { Shirt, Package, FileText, Phone, Pill, Info } from 'lucide-react';

const CATEGORIES = [
  { key: 'clothing',      label: 'Clothing',       Icon: Shirt,    color: 'text-blue-500',   bg: 'bg-blue-50'   },
  { key: 'toiletries',   label: 'Toiletries',     Icon: Package,  color: 'text-purple-500', bg: 'bg-purple-50' },
  { key: 'documents',    label: 'Documents',      Icon: FileText, color: 'text-amber-500',  bg: 'bg-amber-50'  },
  { key: 'electronics',  label: 'Electronics',    Icon: Phone,    color: 'text-green-500',  bg: 'bg-green-50'  },
  { key: 'medications',  label: 'Medications',    Icon: Pill,     color: 'text-red-500',    bg: 'bg-red-50'    },
  { key: 'miscellaneous',label: 'Miscellaneous',  Icon: Package,  color: 'text-slate-500',  bg: 'bg-slate-50'  },
];

const PackingListTab = ({ data }) => (
  <div className="space-y-4">
    <div className="grid sm:grid-cols-2 gap-4">
      {CATEGORIES.map(({ key, label, Icon, color, bg }) => {
        const items = data.categories?.[key] || [];
        if (!items.length) return null;
        return (
          <div key={key} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className={`flex items-center gap-2 mb-3 pb-2 border-b border-slate-50`}>
              <div className={`p-1.5 ${bg} rounded-lg`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <span className="font-bold text-slate-800 text-sm">{label}</span>
              <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <ul className="space-y-1.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
    {data.note && (
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>{data.note}</p>
      </div>
    )}
  </div>
);

export default PackingListTab;

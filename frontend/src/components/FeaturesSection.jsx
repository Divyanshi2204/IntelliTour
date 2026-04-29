import { Sparkles, CalendarDays, Map } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <div id="features" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-brand-600">Travel Smarter</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need for the perfect trip
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">

            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-slate-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                AI Generation
              </dt>
              <dd className="mt-2 text-base leading-7 text-slate-600">Generated instantly based on your unique travel style and budget requirements.</dd>
            </div>

            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-slate-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                  <CalendarDays className="h-6 w-6 text-white" />
                </div>
                Daily Schedules
              </dt>
              <dd className="mt-2 text-base leading-7 text-slate-600">Beautiful timelines showing exactly what you'll do morning, afternoon, and evening.</dd>
            </div>

            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-slate-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                  <Map className="h-6 w-6 text-white" />
                </div>
                Cost Estimates
              </dt>
              <dd className="mt-2 text-base leading-7 text-slate-600">Know roughly what you'll spend on every activity, food stop, and transport.</dd>
            </div>

          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

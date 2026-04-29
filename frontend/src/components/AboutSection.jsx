import { Sparkles } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="bg-white py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Two Halves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Half: Story & Mission */}
          <div>
            <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4">About IntelliTour</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              We believe travel planning <br className="hidden md:block" /> should be effortless
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed mb-10">
              <p>
                Traditional trip planning takes hours of research across multiple tabs, reading reviews, comparing hotels, finding activities, and mapping out transport. It turns what should be an exciting process into a stressful chore.
              </p>
              <p>
                IntelliTour uses advanced AI to do all of that in seconds. By understanding your unique preferences, budget, and travel style, we give you a fully structured, personalized itinerary instantly, so you can focus on the journey itself.
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex gap-0 divide-x divide-gray-200 border-y border-gray-100 py-6">
              <div className="px-4 first:pl-0">
                <p className="text-2xl font-bold text-blue-600">10,000+</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Trips Generated</p>
              </div>
              <div className="px-4">
                <p className="text-2xl font-bold text-blue-600">30 sec</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Avg. Plan Time</p>
              </div>
              <div className="px-4">
                <p className="text-2xl font-bold text-blue-600">150+</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Destinations</p>
              </div>
            </div>
          </div>

          {/* Right Half: Visual Card Stack */}
          <div className="relative mt-8 lg:mt-0 w-full max-w-md mx-auto lg:mx-0">
            {/* Back Card Offset */}
            <div className="hidden sm:block absolute -top-4 -right-4 w-full h-full rounded-2xl bg-blue-50 border border-blue-100"></div>

            {/* Front Card */}
            <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <span className="text-xl">🗼</span>
                <h3 className="font-bold text-gray-900">Paris, France · 5 Days</h3>
              </div>

              <div className="space-y-5">
                <div className="border-l-4 border-blue-500 pl-4 relative">
                  <div className="absolute -left-[6px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="font-semibold text-gray-900 text-sm">Day 1: Eiffel Tower & Seine Cruise</p>
                  <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded">10:00 AM - 4:00 PM</span>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 relative">
                  <div className="absolute -left-[6px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="font-semibold text-gray-900 text-sm">Day 2: Louvre Museum Highlights</p>
                  <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded">9:30 AM - 1:00 PM</span>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 relative">
                  <div className="absolute -left-[6px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="font-semibold text-gray-900 text-sm">Day 3: Montmartre & Sacré-Cœur</p>
                  <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded">11:00 AM - 5:00 PM</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">Budget: Moderate</span>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

# IntelliTour: Frontend Data Parsing & Rendering Explanation

This document provides a complete end-to-end walkthrough of the data flow in the IntelliTour application—from the moment a user submits a prompt to the final rendering of the AI-generated itinerary on the screen.

---

## 🔁 Full Data Flow: Prompt → AI → Database → Screen

### STEP 1 — User Fills the Form (`NewTripPage.jsx`)

The user fills in `destination`, `days`, `budget`, `preferences` etc. and hits **Generate**. The frontend sends this to the backend:

```js
// NewTripPage.jsx (simplified)
const res = await api.post('/trips/generate', {
  destination,
  days,
  budget,
  currency,
  budgetLevel,
  preferences,
});
// After success → navigate to /trip/:id
navigate(`/trip/${res.data.trip._id}`);
```

---

### STEP 2 — Backend Gets the Request (`tripController.js`)

The backend receives the request at `POST /api/trips/generate`:

```js
// Step 1: Save a placeholder Trip to MongoDB immediately
let trip = await Trip.create({
  userId: req.user._id,
  destination,
  days,
  status: 'generating',   // ← marked as 'generating'
});

// Step 2: Call the Groq AI service
const aiResult = await groqService.generateItinerary({ destination, days, budget, ... });

// Step 3: Write the AI output into the Trip document
trip.itinerary   = aiResult.days;        // ← the array of Day objects
trip.tripSummary = aiResult.tripSummary; // ← the 2-3 sentence overview
trip.status      = 'completed';
await trip.save();

// Step 4: Send the full trip back to the frontend
res.status(201).json({ success: true, trip });
```

---

### STEP 3 — AI Returns Strict JSON (`groqService.js`)

The Groq API is called with `response_format: { type: "json_object" }`. This **forces** Llama 3 to respond with this exact shape:

```json
{
  "tripSummary": "Paris is a city of romance...",
  "days": [
    {
      "day": 1,
      "title": "Arrival & Eiffel Magic",
      "theme": "Sightseeing",
      "dailySummary": "Settle in and explore iconic landmarks.",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Visit Eiffel Tower",
          "description": "...",
          "location": "Champ de Mars",
          "category": "sightseeing",
          "estimatedCost": "€25",
          "tips": "Go early to avoid queues."
        }
      ]
    }
  ]
}
```

This JSON is then saved *directly* into MongoDB's `Trip.itinerary` field (the nested `daySchema` and `activitySchema` Mongoose schemas).

---

### STEP 4 — Frontend Loads the Trip (`TripDetailPage.jsx`)

After navigation, `TripDetailPage` mounts and immediately fires an API call using the trip `id` from the URL:

```js
// Lines 75–80 in TripDetailPage.jsx
useEffect(() => {
  api.get(`/trips/${id}`)        // GET /api/trips/:id
    .then((res) => setTrip(res.data.trip))  // ← stores the full trip object in state
    .catch(() => toast.error('Failed to load trip details.'))
    .finally(() => setLoading(false));
}, [id]);
```

The **`trip` state** now contains the full object including `trip.itinerary` (array of days), `trip.tripSummary`, `trip.destination`, `trip.days`, `trip.budgetFormatted`.

---

### STEP 5 — Rendering: `tripSummary` (the intro card)

```jsx
{/* Lines 216–221 in TripDetailPage.jsx */}
{trip.tripSummary && (
  <div className="bg-white rounded-2xl shadow-md ...">
    <h2>AI Trip Synthesis</h2>
    <p>{trip.tripSummary}</p>   {/* ← The 2-3 sentence AI overview */}
  </div>
)}
```

This renders **only if** `tripSummary` exists—a safeguard using `&&`.

---

### STEP 6 — Rendering: The Day-by-Day Timeline

```jsx
{/* Lines 223–273 in TripDetailPage.jsx */}
{trip.itinerary?.map((day, dIdx) => (
  <div key={`day-${day.day}`}>

    {/* Day Header — "Day 1 — Arrival & Eiffel Magic" */}
    <h2>Day {day.day}</h2>
    <span>— {day.title}</span>
    <p>{day.dailySummary}</p>

    {/* Activities loop — draws the vertical timeline line */}
    <div className="border-l-2 border-slate-200 ml-4">
      {day.activities.map((activity, aIdx) => (
        <div key={`act-${dIdx}-${aIdx}`} className="pl-8">

          {/* The circular dot on the timeline */}
          <div className="absolute -left-[11px] rounded-full border-brand-500" />

          {/* Activity Card */}
          <div>
            {getCategoryIcon(activity.category)} {/* icon based on category */}
            <h3>{activity.title}</h3>
            <Clock /> {activity.time}
            <p>{activity.description}</p>
            <MapPin /> {activity.location}
            <DollarSign /> {activity.estimatedCost}

            {activity.tips && (
              <div className="bg-amber-50">
                <Sparkles /> Pro Tip: {activity.tips}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
))}
```

---

### STEP 7 — How `getCategoryIcon` Works

The `category` field from the AI (`"food"`, `"sightseeing"`, etc.) is used to pick a colour-coded icon:

```js
// Lines 37–47 in TripDetailPage.jsx
const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'food':          return <Utensils className="text-orange-500" />;
    case 'sightseeing':   return <Camera   className="text-blue-500"   />;
    case 'adventure':     return <Map      className="text-green-500"  />;
    case 'transport':     return <Bus      className="text-slate-500"  />;
    case 'accommodation': return <Home     className="text-indigo-500" />;
    default:              return <Info     className="text-slate-400"  />;
  }
};
```

---

### 🗺️ Complete Flow Summary

```
User fills form (NewTripPage)
         │
         ▼
POST /api/trips/generate  (with JWT in header)
         │
         ▼
tripController.js → creates Trip (status: 'generating')
         │
         ▼
groqService.js → calls Groq API (Llama 3, JSON mode)
         │
         ▼
AI returns strict JSON { tripSummary, days: [...] }
         │
         ▼
Saved to MongoDB Trip document (status: 'completed')
         │
         ▼
Response sent → navigate('/trip/:id')
         │
         ▼
TripDetailPage mounts → GET /api/trips/:id
         │
         ▼
setTrip(res.data.trip) → state updated
         │
         ├──► trip.tripSummary  → renders "AI Trip Synthesis" card
         │
         └──► trip.itinerary.map(day)
                   └──► day.activities.map(activity)
                             └──► Activity Card + Timeline dot + Category Icon
```

The key insight is that MongoDB stores the itinerary as a **nested array of sub-documents** (not a string), so the frontend can directly use `.map()` on it—no parsing needed at the frontend level.

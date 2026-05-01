# IntelliTour: Viva & Cross-Examination Questions

This document contains a comprehensive list of potential cross-questions (viva questions) that an examiner might ask about the **IntelliTour** project, along with detailed, technical answers to help you prepare.

---

## Section 1: Architecture & Technology Stack

**Q1. Why did you choose the MERN stack (MongoDB, Express, React, Node.js) for this project?**
**Answer:** The MERN stack is highly unified by JavaScript/JSON. Since the core feature of our application is taking JSON data from an LLM (Groq/Llama 3) and rendering it into a visual timeline, having a stack that natively understands JSON from the database (MongoDB/BSON) through the backend (Node/Express) and up to the frontend (React) removes the need for complex data transformations. MongoDB is also perfectly suited for storing deeply nested, flexible documents like our day-by-day itineraries.

**Q2. How do you manage application state in the React frontend?**
**Answer:** We use React's built-in Context API (`AuthContext`) for global state like user authentication (managing the JWT token and user profile). For component-specific state (like forms, loading indicators, or tab selections in the Trip Detail page), we use standard `useState` and `useEffect` hooks. We avoided heavy libraries like Redux to keep the application lightweight, as our state needs are relatively localized.

---

## Section 2: AI Integration & Data Generation (Phase 3)

**Q3. If LLMs usually output unstructured text, how did you ensure the itinerary renders perfectly in the frontend UI without breaking?**
**Answer:** We achieved this through strict **Prompt Engineering** and API constraints. 
1. We explicitly provided a JSON schema in the system prompt that the AI must follow.
2. We utilized the `response_format: { type: "json_object" }` flag in the Groq SDK. This forces the LLM (Llama 3) to strictly output valid, parseable JSON rather than conversational text. The backend parses this JSON using `JSON.parse()` before saving it to MongoDB, guaranteeing the frontend receives a predictable array of days and activities.

**Q4. Why did you choose Groq (Llama 3) instead of OpenAI (ChatGPT) or Google Gemini?**
**Answer:** We evaluated models based on latency and cost. Groq relies on highly specialized hardware (LPUs) that provide blistering fast inference speeds. Because generating a 5-day or 10-day itinerary involves a large token output, using Groq significantly reduces the waiting time for the user, improving the overall User Experience (UX) without sacrificing the quality of the structured data.

**Q5. What happens if the AI fails or takes too long to respond?**
**Answer:** We implemented a synchronous long-polling architecture (or placeholder strategy). When a request comes in, we first create a `Trip` document in MongoDB with a status of `'generating'`. If the AI call fails or times out, the `try/catch` block catches the error, updates the trip status to `'failed'`, and returns a 500 error to the client. The frontend catches this and displays a graceful `react-hot-toast` error notification rather than crashing.

---

## Section 3: Authentication & Security (Phase 2)

**Q6. Can you explain your authentication flow? Why use JWT instead of Sessions?**
**Answer:** We use **JSON Web Tokens (JWT)**. When a user logs in (or verifies their OTP), the server signs a JWT containing the user's ID and sends it back. The React client stores this token in `localStorage` and attaches it as a `Bearer` token in the `Authorization` header for subsequent requests. 
We chose JWT over traditional cookies/sessions because it is **stateless**. The backend doesn't need to query the database or memory for every request to verify a session; it just cryptographically verifies the token. This makes the API easily scalable and ready for mobile apps.

**Q7. How does the Google OAuth integration work alongside the standard Email/Password login?**
**Answer:** We used `passport.js` with the `passport-google-oauth20` strategy. When Google redirects back to our server, we check if the `googleId` or `email` already exists. 
* If the user already registered via email, we link the `googleId` to their account and auto-verify them. 
* If they are new, we create a `User` document *without* a password. 
Finally, the server issues a JWT just like a standard login, destroys the temporary OAuth session, and redirects to the React frontend with the token in the URL.

**Q8. How are user passwords stored in the database?**
**Answer:** Passwords are never stored in plain text. We use `bcryptjs` within a Mongoose `pre('save')` hook. Before a new user is saved (or password updated), a cryptographic salt is generated (12 rounds), and the password is hashed. When logging in, we use `bcrypt.compare()` to verify the input against the hash.

---

## Section 4: Frontend Performance & Visuals (Phase 4)

**Q9. On the `TripDetailPage`, you have tabs for Timeline, Packing List, Budget, and Weather. Do you load all this data at once?**
**Answer:** No, we implemented **Lazy Loading** for the tabs. The AI itinerary (Timeline) is fetched initially because it's the core view. The Packing List, Budget, and Weather tabs maintain a state of `{ loaded: false }`. When a user clicks one of those tabs, *only then* does the frontend make an API call to the backend to generate or fetch that specific data. This saves significant API costs and reduces the initial page load time.

**Q10. How did you implement the "Export PDF" functionality?**
**Answer:** We designed the UI layout using Tailwind CSS with specific consideration for print media queries (`@media print`). Elements like navbars, buttons, and sidebars have classes like `print:hidden`. When the user clicks Export, it triggers `window.print()`, which strips away the UI and cleanly prints the timeline structure. *(Alternatively, mention libraries like `jspdf` or `html2canvas` if you utilized them for programmatic PDF generation).*

---

## Section 5: API Security & Robustness

**Q11. What measures did you take to protect your backend API from malicious attacks?**
**Answer:** 
1. **Rate Limiting:** We use `express-rate-limit` to prevent spamming. We have a strict limit on auth endpoints to prevent brute-force attacks, and a general limit to prevent users from draining our AI API credits.
2. **Helmet:** We use the `helmet` middleware to set secure HTTP headers (protecting against XSS, clickjacking, etc.).
3. **CORS:** We strictly configured Cross-Origin Resource Sharing to only accept requests from our designated frontend URLs.
4. **Validation:** We use `express-validator` to sanitize and validate all incoming body payloads before they reach our controllers or the database.

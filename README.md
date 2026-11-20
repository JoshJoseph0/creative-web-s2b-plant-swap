# Plant Swap Shelf 🌱

A full-stack plant-sharing web application for Bath Spa University's **Creative Web (S2b)** checkpoint. The idea is a simple shared shelf where organisers can list plants and cuttings, see what's available, and manage their collection.

**Status:** Work in progress. This README separates features found in the current source code from coursework requirements that still need implementing.

## Tech stack

- **Frontend:** Svelte 5 and SvelteKit, with reusable Svelte components and a responsive sidebar
- **Backend:** Node.js and Express 5, running as a separate server
- **Database:** MongoDB (including MongoDB Atlas) using Mongoose
- **Styling:** CSS and Lucide icons

The request flow is:

```text
Browser
   ↓
SvelteKit frontend (localhost:5173 by default)
   ↓ server-side fetch / form actions
Express API (localhost:3000)
   ↓ Mongoose
MongoDB
```

## Repository structure

```text
creative-web-s2b-plant-swap/
├── express-api/
│   ├── index.js                  # Connects to MongoDB and starts Express
│   ├── models/Plant.js           # Plant schema and Mongoose model
│   ├── routes/plants.js          # Plant API routes
│   ├── .env.example
│   └── package.json
├── sveltekit-app/
│   ├── src/lib/components/       # PlantCard, PlantForm, tag picker, sidebar
│   ├── src/lib/server/plantApi.js # Server-side Express API requests
│   ├── src/routes/shelf/         # Shelf, add-plant page, single-plant page
│   ├── src/routes/plants/        # Plant browsing page
│   ├── src/routes/api/plants/    # SvelteKit form endpoint
│   ├── .env.example
│   └── package.json
└── README.md
```

## What is in the current code

- A plant list loaded from MongoDB through the Express API
- An add-plant form with **name**, **species**, **light needs**, and selectable **tags**
- A Mongoose `Plant` model with `name`, `species`, `lightNeeds`, `tags` and `swapped`
- Light-need values of `low`, `medium` or `bright`
- Individual plant pages at `/shelf/[id]` and 404 responses for missing or malformed IDs
- Plant deletion from the shelf, sent through SvelteKit to Express
- Reusable plant cards, a sidebar and responsive styling
- A placeholder for plant photos when no image URL exists

The `swapped` field exists in the database model, but **there is not yet an API/UI action to toggle it**. The current list route does **not** filter by light requirements in MongoDB. Image and extra care metrics are supported by the card component but are not populated by the current Express plant response.

## Run locally

You will need Node.js/npm and access to a MongoDB database. Run the **Express and SvelteKit apps in separate terminals**.

### 1. Clone the repository

```bash
git clone https://github.com/JoshJoseph0/creative-web-s2b-plant-swap.git
cd creative-web-s2b-plant-swap
```

### 2. Set up the Express API

```bash
cd express-api
npm install
```

Create a local file named `.env` in `express-api/` based on `.env.example`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/PlantJosh
```

This is a **local MongoDB example**, not an Atlas connection. If using MongoDB Atlas, replace it with your own Atlas connection string and set the **database path** to your personal course database, for example `PlantJosh`. Keep the username/password private.

Start the API:

```bash
npm run dev
```

Express should listen at **http://localhost:3000** after a successful database connection.

### 3. Set up the SvelteKit frontend

Open a **second terminal** at the repository root:

```bash
cd sveltekit-app
npm install
```

Create `sveltekit-app/.env`:

```dotenv
EXPRESS_API_URL=http://localhost:3000
```

Then start SvelteKit:

```bash
npm run dev
```

Open the local address shown by Vite (usually **http://localhost:5173**). The home page redirects to `/shelf`.

Both servers must be running. If you change either `.env`, restart the affected server.

> **Security:** Never commit real `.env` files, Atlas credentials or `node_modules`. The root `.gitignore` excludes these. Only commit `.env.example` files with safe placeholder values. Any credentials requested by the university must be transferred through an approved private submission method, not GitHub.

## API endpoints

| Method | Express endpoint | Current behaviour |
| --- | --- | --- |
| `GET` | `/plants` | List all saved plants, newest first |
| `GET` | `/plants/:id` | Get one plant or return 404 |
| `POST` | `/plants` | Create a plant with validated name, species, light needs and tags |
| `DELETE` | `/plants/:id` | Delete one plant |

The `POST` form is handled by SvelteKit at `src/routes/api/plants/+server.js`. Deleting from the shelf uses the `delete` form action in `src/routes/shelf/+page.server.js`.

## Follow the flow — coursework questions

### 1. Which database and collection does Express use?

`express-api/index.js` reads `process.env.MONGODB_URI` and passes it to `mongoose.connect(...)`. **The database name is determined by the database path in that URI**, so check your own private Express `.env`; the example above uses `PlantJosh`, but the repository cannot prove which database a deployed/local instance currently uses.

`express-api/models/Plant.js` defines `mongoose.model('Plant', plantSchema)`. By Mongoose's default naming convention, this model uses the **`plants` collection**. MongoDB normally creates the collection when the first document is saved.

### 2. How does the light filter travel through the app?

**Target flow (not yet implemented):**

```text
/shelf?light=low
  → sveltekit-app/src/routes/shelf/+page.server.js
      load() reads url.searchParams.get('light')
  → sveltekit-app/src/lib/server/plantApi.js
      sends the light query to Express
  → express-api/routes/plants.js
      GET /plants reads req.query.light
  → Plant.find({ lightNeeds: 'low' })
  → MongoDB returns matching plants
  → Express sends JSON → SvelteKit load() → +page.svelte renders cards
```

**Current behaviour:** `load()` calls `getPlants(fetch)` without reading the query string, and Express uses `Plant.find()` with no light filter. This requirement is still to do. Filtering must happen in MongoDB, not through `Array.filter()` in the browser.

### 3. How are plant IDs handled?

MongoDB generates an `_id` of type **ObjectId**, normally shown as a 24-character hexadecimal string (e.g. `507f1f77bcf86cd799439011`).

`express-api/routes/plants.js` converts `plant._id.toString()` into the JSON field `id`. The SvelteKit card uses this string for links such as `/shelf/507f1f77bcf86cd799439011`, and `src/routes/shelf/[id]/+page.server.js` loads the single plant using `getPlant(fetch, params.id)`.

Do **not** turn a MongoDB ID into a number. Both the Express route and the SvelteKit API helper check its hexadecimal format. Invalid/missing plant IDs return a 404 for the detail page.

## Remaining S2b checkpoint work

- [ ] Implement the **swapped / available** toggle through SvelteKit → Express → MongoDB; verify the state survives a refresh and server restart.
- [ ] Add **All / Low / Medium / Bright** filter links and pass the selected light value through the entire server-side data flow.
- [ ] Confirm create, swap, delete and filter changes persist after **both** servers restart.
- [ ] Save **at least three plants** in the personal MongoDB database for the tutor to test.
- [ ] Test the detail page for a real ID, an invalid ID (e.g. `zzz`) and a well-formed but nonexistent ID.
- [ ] Double-check the two `.env.example` files, the actual database name and local setup from a fresh clone.
- [ ] Submit the GitHub URL and any separately requested private environment files via the university VLE, following the lecturer's secure instructions.

## Coursework

**Module:** CCO6102-40 — Creative Web, Bath Spa University.

**S2b Plant Swap Shelf checkpoint:** Sunday **22 November 2026 at 11:59**, according to the newer checkpoint brief supplied for this project. The text did not clarify **am versus pm**, so the **Ultra/VLE deadline is the authoritative source**. An older general S2b calendar entry lists 20 November; this project's newer Plant Swap Shelf brief supersedes it.

This project is being developed as coursework and is not a finished public service.

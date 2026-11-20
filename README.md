# Plant Swap Shelf 🌱

A full-stack plant-sharing application built for Bath Spa University's **Creative Web — S2b checkpoint** (CCO6102-40). Organisers can save plants, see which are available, mark them swapped or available again, delete listings, and explore demonstration plants from other owners.

The application is built as **two separate Node.js projects in one repository**:

```text
Browser
  ↓
SvelteKit frontend (usually localhost:5173)
  ↓ server-side requests / SvelteKit endpoints and actions
Express API (localhost:3000)
  ↓ Mongoose
MongoDB Atlas
```

## Features

- **Your Shelf** (`/shelf`): list your saved plants, including name, species, light requirement, tags and availability.
- **Add a plant** (`/shelf/add`): create a plant with name, species, light needs and optional tags/photo.
- **Mark swapped / Mark available**: change the `swapped` Boolean for your own plant. The status is saved in MongoDB and can be changed back.
- **Filter by light**: All, Low, Medium and Bright links use `/shelf?light=...`. Filtering happens in the **MongoDB query**, not by filtering cards in the browser.
- **Plant detail page** (`/shelf/[id]`): load a plant by its MongoDB ID; malformed or missing IDs return 404.
- **Remove a plant**: delete one of your listings from the shelf.
- **Community plants** (`/plants`): browse seeded demonstration listings and open details.
- **Optional demo exchange**: offer one of your own available plants in exchange for an available demo plant. The Express service uses a MongoDB transaction to update both records together; this is separate from the basic status toggle.
- **Perenual search**: optionally look up a plant to pre-fill its common/scientific name, photo, light needs and tags; manual entry works when the external service is unavailable.
- **Photo credit**: when the provider supplies licensing metadata, links are shown alongside the saved photo.

The application is a **coursework prototype**, not a publicly authenticated marketplace. Owner IDs are simplified demo values rather than real user accounts.

## Repository layout

```text
creative-web-s2b-plant-swap/
├── README.md
├── .gitignore
├── express-api/
│   ├── index.js                     # Express on port 3000; Mongoose connection
│   ├── models/Plant.js              # Mongoose schema, model and collection
│   ├── routes/plants.js             # CRUD, status toggle, DB filter, demo swap
│   ├── routes/perenual.js           # External plant-search endpoints
│   ├── services/swapPlants.js       # MongoDB transaction for demo exchanges
│   ├── services/perenualService.js  # Provider normalization and requests
│   ├── scripts/seed-demo-plants.js  # Optional demo seed
│   ├── .env.example                 # Safe template; NOT real credentials
│   └── package.json
└── sveltekit-app/
    ├── src/lib/components/          # PlantCard, PlantForm, sidebar and tags
    ├── src/lib/server/plantApi.js    # Server-side Express API helper
    ├── src/routes/shelf/            # Main list, form actions, add and detail
    ├── src/routes/plants/           # Community listings
    ├── src/routes/api/plants/       # SvelteKit create, status and delete endpoints
    ├── src/routes/api/plant-search/  # Search proxy
    ├── .env.example
    └── package.json
```

## Local setup

**Prerequisites:** recent Node.js (22+ recommended), npm and a running MongoDB database or a MongoDB Atlas cluster accessible from your machine. The frontend and backend run as **separate Node processes**.

### 1. Clone

```bash
git clone https://github.com/JoshJoseph0/creative-web-s2b-plant-swap.git
cd creative-web-s2b-plant-swap
```

### 2. Express backend (terminal one)

```bash
cd express-api
npm install
```

Copy `.env.example` to a **local** `.env` inside `express-api`.

```dotenv
# Example for local MongoDB; replace with a private Atlas URI if needed
MONGODB_URI=mongodb://127.0.0.1:27017/PlantJosh
# Optional: enables Perenual search and automatic demo seeding
PERENUAL_API_KEY=your_own_perenual_key
```

**For the coursework:** use the course cluster with the database **`PlantJosh`** (or another `Plant` + your name, with no punctuation). The database name is the path segment of the **real** `MONGODB_URI` in Express's private `.env`. Do not accidentally connect to a database named `test` or to a different plant demo database. The example above is a *local-only placeholder*, not an Atlas credential.

Start the backend:

```bash
npm run dev
```

Express starts on **http://localhost:3000** once Mongoose connects. `GET http://localhost:3000/plants` should respond with JSON.

### 3. SvelteKit frontend (terminal two)

From the repository root:

```bash
cd sveltekit-app
npm install
```

Copy `sveltekit-app/.env.example` to `sveltekit-app/.env`:

```dotenv
EXPRESS_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open the address printed by Vite (usually **http://localhost:5173**). The home route redirects to `/shelf`. **Both terminals must remain running.** Restart a server after changing its `.env`.

Perenual search is optional; plants can be entered manually if no API key is provided.

### 4. Tests and build checks

```bash
# From express-api/
npm test

# From sveltekit-app/
npm run check
npm run build
```

The existing backend unit tests cover the demo swap service and Perenual data normalization. **A full end-to-end test still requires your own Atlas configuration, both servers running, and browser interaction.**

Optional demo seed (in `express-api`):

```bash
npm run seed:demo
```

This requires the Perenual API key and working provider image URLs. The script uses stable demo keys to avoid duplicating demo records on repeated runs.

## API routes (Express)

| Method | URL | Purpose |
| --- | --- | --- |
| `GET` | `/plants?scope=mine&light=low` | Return your plants that require low light, filtered with Mongoose |
| `GET` | `/plants?scope=community` | List community/demo plants |
| `GET` | `/plants/:id` | Get a plant, or return 404 |
| `POST` | `/plants` | Create and validate a plant |
| `PATCH` | `/plants/:id/swapped` | Save `{ "swapped": true }` or `false` for one of your plants |
| `DELETE` | `/plants/:id` | Delete one of your plants |
| `POST` | `/plants/:id/swap` | Exchange two eligible plants in a database transaction |
| `GET` | `/plant-search/search?q=...` | Optional Perenual plant search |
| `GET` | `/plant-search/:id` | Optional Perenual plant details |

The SvelteKit server talks to Express using `src/lib/server/plantApi.js`. Adding a plant goes through `src/routes/api/plants/+server.js`. The available/swapped toggle and deletion forms submit to **`src/routes/api/plants/[id]/+server.js`**, which calls the corresponding Express endpoints. The shelf is loaded by `src/routes/shelf/+page.server.js`; all add/status/delete operations travel through SvelteKit `+server.js` routes, then Express, Mongoose and MongoDB.

## Follow the flow — answers required by the brief

### 1. Where is the database and collection decided?

In **`express-api/index.js`**, `mongoose.connect(process.env.MONGODB_URI)` reads the backend's private environment variable. The **database name** is the path in the URI (for example `/PlantJosh`). The code does not hardcode the live database name; it depends on that private setting.

In **`express-api/models/Plant.js`**, `mongoose.model('Plant', plantSchema)` defines the **Plant** Mongoose model. By Mongoose's default pluralization, this corresponds to the MongoDB **`plants` collection**. MongoDB creates it when records are inserted.

### 2. Follow the light filter from the URL to MongoDB and back.

1. A visitor clicks **Low** in **`sveltekit-app/src/routes/shelf/+page.svelte`**, navigating to `/shelf?light=low`.
2. **`sveltekit-app/src/routes/shelf/+page.server.js`** runs `load({ fetch, url })`, reads `url.searchParams.get('light')`, validates the value, and calls `getPlants(fetch, 'mine', 'low')`.
3. **`sveltekit-app/src/lib/server/plantApi.js`** builds the request to Express: `GET /plants?scope=mine&light=low`.
4. **`express-api/routes/plants.js`** reads `req.query.light`, validates it and adds `lightNeeds: 'low'` to the owner filter.
5. **`Plant.find(filter)`** in Mongoose queries the MongoDB `plants` collection. MongoDB returns only matching documents.
6. Express serializes the documents to JSON with **`toPlant()`**, SvelteKit's `getPlants()` returns them to `load()`, and **`+page.svelte`** renders the filtered plant cards.

There is **no browser-side `Array.filter()` for the light requirement**.

### 3. What does a plant ID look like, and how is it converted?

MongoDB generates `_id` as an **ObjectId**, usually displayed as 24 hexadecimal characters, for example `507f1f77bcf86cd799439011`. In **`express-api/routes/plants.js`**, `toPlant()` maps `plant._id.toString()` into the JSON field `id`.

**`PlantCard.svelte`** uses that string for links to `/shelf/[id]`. **`sveltekit-app/src/routes/shelf/[id]/+page.server.js`** passes `params.id` to **`getPlant()`** in `src/lib/server/plantApi.js`, which fetches the Express `GET /plants/:id` route. Express validates the ID before querying, and nonexistent/invalid detail URLs result in a 404. Do **not** convert IDs using `Number(id)`; MongoDB IDs are strings in JSON and URLs.

## S2b hand-in checklist

- [x] One repository with independent Express and SvelteKit projects
- [x] Plant schema with `name`, `species`, `swapped` and `lightNeeds`
- [x] Plant listing, add, delete, detail and status-toggle code
- [x] Low/medium/bright choice stored in MongoDB and shown on plant cards
- [x] All/low/medium/bright filter passed to a MongoDB query
- [x] Detail route with 404 handling
- [x] Example environment files without credentials in GitHub
- [x] README technical explanations and run instructions
- [ ] **Before submission:** confirm your private Express `MONGODB_URI` really selects the personal **`PlantJosh`** database, not `plant_swap_shelf` or `test`.
- [ ] **Before submission:** ensure the chosen personal database contains **at least three saved plants**, with low/medium/bright examples if possible.
- [ ] **Before submission:** run `npm test`, `npm run check`, `npm run build` and an actual **two-server restart test**; verify add/status/delete/filter/detail in a browser.
- [ ] **Before submission:** submit the repo link through the VLE and follow your lecturer's approved secure instructions for any required real `.env` files.

**Security:** real `.env` files, database passwords, API keys and `node_modules` must **not** be committed. The root `.gitignore` excludes `.env` files while allowing `.env.example`. Do not publish real Atlas credentials or put them in the README or Git history.

## Assessment

**Module:** Creative Web (CCO6102-40), Bath Spa University. **Checkpoint:** S2b — Plant Swap Shelf. The newer supplied checkpoint brief states **Sunday 22 November 2026, 11:59**, without specifying AM/PM; check Ultra/VLE for the authoritative cut-off and secure submission method.

This repository contains the code and documentation for the prototype. Running it against the correct database and verifying its live behaviour are part of the final hand-in check.

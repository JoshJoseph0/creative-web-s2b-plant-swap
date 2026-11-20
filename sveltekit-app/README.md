# Plant Swap Shelf — SvelteKit frontend

This is the SvelteKit application for the [Plant Swap Shelf coursework project](../README.md). The Express backend is in [`../express-api`](../express-api/).

## Start the frontend

From this directory:

```bash
npm install
```

Copy `.env.example` to a local `.env` file and set:

```dotenv
EXPRESS_API_URL=http://localhost:3000
```

Then start the Express server in another terminal before running:

```bash
npm run dev
```

Vite normally serves the frontend at [http://localhost:5173](http://localhost:5173). The home route redirects to `/shelf`.

Run `npm run check` to check SvelteKit/TypeScript, and `npm run build` for a production build. See the [root README](../README.md) for features, API flow, MongoDB setup and hand-in requirements. Never commit a real `.env`.

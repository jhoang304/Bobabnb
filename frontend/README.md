# BobaBnB frontend

The React and Redux client for BobaBnB, built with Create React App. Setup, environment variables, deployment and the API reference are in the [main README](../README.md).

## Running it

Start the backend first (see [Getting started](../README.md#getting-started)), then:

```bash
npm install
npm start
```

The dev server runs on http://localhost:3000 and forwards `/api` requests to the backend at `http://localhost:8000`, through the `proxy` field in `package.json`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Starts the dev server with hot reloading |
| `npm run build` | Builds the app into `build/`, which the backend serves in production |
| `npm test` | Runs Create React App's test runner. There are no frontend tests yet. |

## Layout

| Path | Contents |
| --- | --- |
| `src/App.js` | Routes |
| `src/components/` | One folder per page or modal |
| `src/store/` | Redux slices (`session`, `spot`, `review`) and `csrfFetch`, which adds the CSRF header to API requests |
| `src/context/Modal.js` | Modal provider and `useModal` hook |
| `public/` | `index.html`, `manifest.json` and the favicon |

# EventsHub frontend

The React frontend for EventsHub fetches events from the ASP.NET Core API and
displays their titles in a Material UI list. It uses TypeScript, Vite, Axios,
Emotion, and Roboto fonts. The React Compiler is enabled through the Babel
preset in `vite.config.ts`.

For backend setup and the full component flow, see the
[project README](../README.md).

## Run locally

Use Node.js `^20.19.0` or `>=22.12.0` and npm, matching the locked Vite
package's engine requirement.

Start the API from the repository root in a separate terminal:

```powershell
dotnet dev-certs https --trust
dotnet run --project src/EventsHub.Api/Eventshub.Api.csproj --launch-profile https
```

Then run these commands from `web/`:

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `https://localhost:3000`. Vite
uses `vite-plugin-mkcert` to create a trusted development certificate. Its
first run may need network access and permission to install the local
certificate authority.

## How the frontend connects to the API

1. `src/main.tsx` mounts `App` inside React `StrictMode`, imports the global
   styles, and loads the Roboto font weights.
2. `src/App.tsx` sends an Axios GET request to
   `https://localhost:5001/api/v1/events` when the component mounts.
3. The API's `EventsController` dispatches `GetEventList.Query` through
   MediatR; its handler reads events from SQLite through `AppDbContext`.
4. The response is stored in the `activities` state and rendered through
   Material UI `List`, `ListItem`, and `ListItemText` components.

The request URL is hardcoded in `src/App.tsx`. There is currently no API URL
configuration through environment variables and no Vite API proxy. If the
backend address changes, update the Axios URL there.

The API permits CORS requests from `http://localhost:3000` and
`https://localhost:3000`. If Vite starts on another port, stop the process using
port 3000 or update the API's allowed origins in
`../src/EventsHub.Api/Program.cs` to match.

## Source layout

| File | Purpose |
| --- | --- |
| `src/main.tsx` | React entry point, StrictMode, global styles, and fonts |
| `src/App.tsx` | Fetches the event list and renders event titles |
| `src/lib/types/index.d.ts` | Global `Activity` response type |
| `src/index.css` | Global page styles |
| `src/App.css` | Existing component stylesheet; currently not imported by `App` |
| `vite.config.ts` | Development port, React plugin, React Compiler, and mkcert |
| `eslint.config.js` | JavaScript, TypeScript, React Hooks, and React Refresh lint rules |

## Scripts

Run these commands from `web/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run lint` | Run ESLint |
| `npm run build` | Run TypeScript project checks and build into `dist/` |
| `npm run preview` | Serve the built frontend locally after a build |

Use the URL printed by `npm run preview`. It may use a different port from
the development server, so calling the API from that origin requires a
matching API CORS configuration. The built app retains the hardcoded localhost
API URL and needs an appropriate API address before deployment.

## Current behavior and troubleshooting

- The UI lists event titles. Event details, create/edit/delete controls, loading
  indicators, and request error messages have not been added yet.
- `Activity` declares numeric `latitude` and `longitude`, but the backend
  `Event` model returns strings. Axios's TypeScript type argument does not
  convert those values; align the type with the contract or explicitly parse
  coordinates before using them as numbers.
- If the list is empty, verify the API is running and inspect the browser's
  Network panel for the `/api/v1/events` request. A connection failure, an
  untrusted API certificate, or a CORS mismatch can prevent the data from
  loading. Open `https://localhost:5001/api/v1/events` directly to check the API.
- React StrictMode can run the mount effect twice during development, which
  can produce two GET requests.

# Frontend Architecture Analysis

The frontend of the Football Championship System is a Single Page Application (SPA) built to deliver a highly interactive, responsive, and robust user interface. 

## Technology Stack

*   **Framework:** React 18
*   **Bundler/Tooling:** Vite
*   **Language:** TypeScript (Strict typing enforced)
*   **Styling:** Tailwind CSS (utility-first css methodology)
*   **Icons:** Lucide React
*   **Routing:** React Router DOM V6
*   **HTTP Client:** Axios (Configured with request interceptors for automated JWT injection)

## Directory Structure & Architectural Pattern

The UI is modularized through a component-based philosophy ensuring high maintainability and code reuse:

```
frontend/
├── public/           # Static uncompiled assets (SVG vectors, manifests)
├── src/
│   ├── components/   # Reusable atomic models
│   │   ├── common/   # Agnostic components (Button, Modal, Header, Sidebar)
│   │   └── forms/    # Data-binding schemas explicitly managing entity creation/mutations
│   ├── context/      # Global state context providers (AuthContext, ThemeContext)
│   ├── hooks/        # Custom React Hooks (e.g. useDebounce) 
│   ├── pages/        # Route specific top-level components (MatchesList, PlayersList, Dashboard, Settings, etc.)
│   ├── services/     # Decoupled API logic wrapping Axios asynchronous handlers
│   ├── types/        # Global TypeScript Schema definitions mirroring Backend schemas
│   ├── App.tsx       # Root entry dictating Routes logic (Protected vs Public routes)
│   ├── index.css     # Core style bindings loading Tailwind imports
│   └── main.tsx      # Application injection entrypoint
├── package.json      # Dependency map & scripts map
├── tailwind.config.js# Custom Tailwind theming overrides
├── tsconfig.json     # Compiler parameters
└── vite.config.ts    # Bundling and reverse-proxy configurations
```

## State Management & Authentication Flow

Unlike complex state machines (e.g., Redux), the system utilizes standard **React Context API** coupled with customized hooks for sufficient scope handling.
1.  **AuthContext:** Captures JWT extraction and lifecycle. It monitors local-storage validity and wraps Protected Routes (`<RequireAuth>`), forcefully redirecting visitors back to `/login` lacking clearance.
2.  **API Services:** Centralized within `/src/services/api.ts`, Axios intercepts outgoing requests and automatically bridges the `Authorization: Bearer <TOKEN>` header universally. Additionally, it handles `401 Unauthorized` responses gracefully allowing re-logins.

## Visual Interface & Responsiveness

Tailwind CSS heavily governs the application styling, minimizing standard CSS class management:
-   **Themes:** Relies partially on dark/light mode context switching embedded within standard component rendering.
-   **Gradients & Accents:** Relies significantly on Cyan/Blue visual accents (`bg-gradient-to-r`, etc.) providing modern UI feels paired with Lucide vector icon sets. 
-   **Modals:** Form interactions prominently utilize dynamic Modals encapsulating input states without abandoning page context.

## Local Build & Proxy Rules

For development processes, **Vite** actively listens and proxies API invocations beginning with `/api` towards the backend server at `http://backend:8000`, successfully circumventing Cross-Origin Resource Sharing (CORS) exceptions across unified interfaces. In production, Docker maps output directly.

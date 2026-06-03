# Pakistan Career Hub — Project Documentation

A modern, AI-powered job portal for Pakistan (a better-UX alternative to Rozee.pk / Mustakbil / PakistanJobsBank). This document explains **what the project is, why each technology was chosen, how it is structured, what each user role can do, and how everything works together**.

---

## 1. What is this project?

**Pakistan Career Hub (PCH)** is the **frontend** of a job portal. It lets:

- **Job seekers (candidates)** search and apply to jobs, build resumes, get AI recommendations, and track applications.
- **Employers** post jobs, review applicants, schedule interviews, and see hiring analytics.
- **Admins** manage users, verify employers, moderate jobs, manage categories, and track revenue/site analytics.

It is built as a **Single Page Application (SPA)** — the browser loads the app once, then navigates between pages instantly without full page reloads.

> **Important:** This is a **frontend-only** build. There is no real backend yet. All data is **mocked** in the browser (see [Data Layer](#9-the-data-layer-mock-backend)). Every API function is written so it can be swapped for a real server call later without rewriting the UI.

---

## 2. Tech stack — what & why

| Technology | What it does | Why we use it |
|---|---|---|
| **React 19 + TypeScript** | UI library + type safety | Component-based UI; TypeScript catches bugs before runtime and documents the code |
| **Vite** | Build tool / dev server | Extremely fast startup and hot reload; optimized production builds with code-splitting |
| **Tailwind CSS** | Utility-first styling | Rapid, consistent, responsive styling without writing custom CSS files |
| **Shadcn-style UI** (Radix UI) | Accessible component primitives | Pre-built, accessible building blocks (dialogs, dropdowns, selects) we fully control |
| **React Router DOM** | Routing / navigation | Maps URLs to pages, supports nested layouts and protected routes |
| **Zustand** | Global state management | Tiny, simple store for auth, theme, saved jobs, applications — no boilerplate |
| **React Hook Form + Zod** | Forms + validation | Performant forms with type-safe, declarative validation rules |
| **Axios** | HTTP client | Centralized API layer with auth token injection and error handling |
| **Recharts** | Charts | Dashboards/analytics graphs (area, bar, pie, line) |
| **Lucide React** | Icons | Clean, consistent, tree-shakeable icon set |
| **Framer Motion** | Animations | Smooth page transitions and micro-interactions |

---

## 3. Architecture principle — Feature-Based Modular

Instead of dumping all pages and components into shared folders, the project is organized **by feature/domain**. Each feature is **self-contained** with its own API, pages, components, hooks, types, and schemas.

**Why this matters:**
- Easy to find code (everything about "jobs" lives in `features/jobs/`).
- Features are isolated — changing one rarely breaks another.
- Scales well as the app grows (the way LinkedIn/Indeed-scale apps are built).
- New developers can own a single feature without understanding the whole codebase.

---

## 4. Folder structure

```
src/
├── app/                      # App-level wiring (not feature-specific)
│   ├── router/               # Route definitions, split by role
│   │   ├── index.tsx         # Combines all route groups + lazy loading
│   │   ├── public-routes.tsx     # Public pages (home, jobs, auth...)
│   │   ├── candidate-routes.tsx  # /candidate/* (protected)
│   │   ├── employer-routes.tsx   # /employer/*  (protected)
│   │   └── admin-routes.tsx      # /admin/*     (protected)
│   ├── layouts/              # Page shells (navbar/sidebar/footer)
│   │   ├── PublicLayout.tsx       # Navbar + footer for public pages
│   │   ├── DashboardLayout.tsx    # Shared sidebar + header shell
│   │   ├── CandidateLayout.tsx    # Candidate sidebar config
│   │   ├── EmployerLayout.tsx     # Employer sidebar config
│   │   └── AdminLayout.tsx        # Admin sidebar config
│   ├── providers/            # Context providers (theme, auth, query)
│   └── store/                # Global Zustand stores
│       ├── auth.store.ts          # Logged-in user + token + role
│       ├── ui.store.ts            # Sidebar/menu open states
│       └── theme.store.ts         # Light/dark theme
│
├── features/                 # All business domains (the heart of the app)
│   ├── auth/                 # Login, register, password reset, verify email
│   ├── jobs/                 # Job search, listing, details, home page
│   ├── companies/            # Company list + profiles
│   ├── candidates/           # Candidate dashboard pages
│   ├── employers/            # Employer dashboard pages
│   ├── applications/         # Application tracking (apply / withdraw)
│   ├── resumes/              # Resume builder
│   ├── ai/                   # AI matching engine + Career AI tools
│   └── admin/                # Admin panel pages
│
├── shared/                   # Reusable across all features
│   ├── components/
│   │   ├── ui/               # Low-level primitives (button, card, input...)
│   │   └── common/           # Composed shared parts (navbar, footer, StatCard...)
│   ├── hooks/                # Reusable hooks
│   ├── services/             # http.ts (axios) + mock-data.ts
│   ├── lib/                  # utils.ts (formatters, cn(), helpers)
│   ├── constants/            # Cities, categories, routes, salary ranges...
│   └── types/                # Shared TypeScript types (User, Pagination...)
│
├── styles/globals.css        # Tailwind + theme variables
└── main.tsx                  # App entry point (mounts React + providers)
```

### Inside each feature folder

```
features/<name>/
├── api/        # Functions that fetch/send data (currently mock)
├── pages/      # Full page components (mapped to routes)
├── components/ # Feature-specific UI pieces
├── hooks/      # Feature-specific logic / state
├── schemas/    # Zod validation schemas for forms
└── types/      # TypeScript types for this feature
```

---

## 5. How the app boots (the flow)

```
main.tsx
  └─ wraps the app in providers (order matters):
     <BrowserRouter>          → enables URL routing
       <ThemeProvider>        → applies light/dark theme
         <QueryProvider>      → data-fetching context
           <AuthProvider>     → restores logged-in user from storage
             <ToastProvider>  → global toast notifications
               <App />        → renders <AppRouter />
```

`AppRouter` (in `app/router/index.tsx`) wraps everything in `<Suspense>` (for lazy loading) and renders four route groups: **public, candidate, employer, admin**.

Every page is **lazy-loaded** (`React.lazy`) — the browser only downloads a page's code when you actually visit it. This is why the production build splits into many small files (code-splitting) and loads fast.

---

## 6. Routing & layouts

- **Public routes** use `PublicLayout` (top navbar + footer). No login required.
- **Dashboard routes** use `DashboardLayout` (collapsible sidebar + header). The sidebar links differ per role (`CandidateLayout`, `EmployerLayout`, `AdminLayout`).
- Dashboard routes are wrapped in **`ProtectedRoute`**, which:
  1. Waits until the auth state is restored from storage.
  2. Redirects to `/auth/login` if not signed in.
  3. Redirects to home if signed in but **wrong role** (e.g. a candidate trying to open `/admin`).

### Route map

| Area | URL | Access |
|---|---|---|
| Home | `/` | Everyone |
| Jobs list | `/jobs` | Everyone |
| Job details | `/jobs/:id` | Everyone (apply needs login) |
| Remote / Government jobs | `/jobs/remote`, `/jobs/government` | Everyone |
| Companies | `/companies`, `/companies/:id` | Everyone |
| About / Contact / Privacy / Terms | `/about` … | Everyone |
| Auth | `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email` | Everyone |
| Candidate dashboard | `/candidate/*` | **Candidate only** |
| Employer dashboard | `/employer/*` | **Employer only** |
| Admin panel | `/admin/*` | **Admin only** |

---

## 7. Authentication & how login works

State lives in `auth.store.ts` (Zustand + `persist`), so the user stays logged in across refreshes (stored in `localStorage`).

**Flow:**
1. User submits the login form → validated by Zod.
2. `useAuth().signIn()` calls the mock auth API.
3. On success, `setAuth(user, token)` saves the user + token.
4. The user is redirected to **their role's dashboard** automatically:
   - candidate → `/candidate`
   - employer → `/employer`
   - admin → `/admin`
5. `ProtectedRoute` then guards every dashboard page.

**Demo accounts** (any password works in the demo):

| Role | Email |
|---|---|
| Candidate | `candidate@demo.pk` |
| Employer | `employer@demo.pk` |
| Admin | `admin@demo.pk` |

(The login page also has one-click buttons to fill these in.)

---

## 8. User roles — who can access what

### 👤 Candidate (Job Seeker)
Goal: find and land a job.

| Page | What they can do |
|---|---|
| **Overview** | Dashboard: application stats, AI recommendations, profile strength, recent activity |
| **Profile** | Edit personal info, headline, skills, bio, links |
| **Resume** | Build a resume, get an AI resume score, upload/download |
| **Recommended** | AI-matched jobs with a compatibility % and reasons |
| **Applications** | Track every job applied to, filter by status, withdraw |
| **Saved Jobs** | Jobs bookmarked for later |
| **Job Alerts** | Create alerts (keyword/city/category/frequency) |
| **Career AI** | Resume scoring, AI feedback, cover-letter generator, interview-question generator |
| **Settings** | Account, password, notifications, theme |

### 🏢 Employer (Recruiter)
Goal: hire the right people.

| Page | What they can do |
|---|---|
| **Overview** | Hiring dashboard: active jobs, applicants, charts |
| **Company Profile** | Manage the public company page |
| **My Jobs** | List of posted jobs; pause/close/delete; edit |
| **Post / Edit Job** | Create or update a job listing (validated form) |
| **Applicants** | Review candidates, shortlist or reject, see match % |
| **Interviews** | Schedule and manage interviews |
| **Analytics** | Applications trend, sources, job performance charts |
| **Settings** | Account, notifications (new applicant alerts, reports) |

### 🛡️ Admin (Platform Operator)
Goal: keep the platform healthy and run the business.

| Page | What they can do |
|---|---|
| **Overview** | Platform-wide metrics + pending actions queue |
| **Users** | View/search all users; suspend or activate accounts |
| **Employer Verification** | Approve/reject companies awaiting verification |
| **Job Moderation** | Approve or remove flagged job listings |
| **Categories** | Create/edit/delete job categories |
| **Revenue** | Subscription revenue charts + transactions |
| **Site Analytics** | Traffic, sign-ups, devices, engagement |
| **Settings** | Account + moderation/verification notifications |

---

## 9. The data layer (mock "backend")

Because there is no real server yet, data comes from two places:

1. **`shared/services/mock-data.ts`** — generates realistic Pakistani data: ~150 jobs, 30 companies, users, applications, notifications.
2. **Per-feature `api/` files** (e.g. `features/jobs/api/jobs.api.ts`) — functions like `fetchJobs()`, `fetchJobById()`, `login()`. They use a small `sleep()` delay to **simulate network latency**, so loading states and skeletons behave like a real app.

**`shared/services/http.ts`** is a configured **Axios** instance that already:
- Adds the auth token to every request (`Authorization: Bearer ...`).
- Handles `401 Unauthorized` by clearing the session.
- Normalizes errors.

### Switching to a real backend later
Replace the body of each `api/` function with a real call, e.g.:

```ts
// Now (mock):
export async function fetchJobs(filters, page) {
  await sleep(500)
  return filterJobs(MOCK_JOBS, filters) // ...
}

// Later (real):
export async function fetchJobs(filters, page) {
  const res = await http.get('/jobs', { params: { ...filters, page } })
  return res.data
}
```

The **UI does not change** — only the data source does. That's the benefit of the api-layer separation.

---

## 10. State management (Zustand stores)

| Store | Purpose |
|---|---|
| `auth.store` | Current user, token, `isAuthenticated`, `hasRole()` — persisted |
| `theme.store` | Light/dark/system theme — persisted |
| `ui.store` | Sidebar / mobile menu open states |
| `useSavedJobs` (jobs) | Bookmarked job IDs — persisted in localStorage |
| `useApplications` (applications) | Jobs the candidate applied to + status |
| `useEmployerJobs` (employers) | Employer's posted jobs (add/edit/delete) |
| `useApplicants` (employers) | Applicant list + shortlist/reject status |

"Persisted" stores survive page refreshes via `localStorage`.

---

## 11. The AI features (how matching works)

Located in `features/ai/services/matching.ts`. The matching engine is **deterministic and explainable** (not a black box). It scores each job 0–100 against a candidate profile using weighted factors:

- **Skills overlap** — 55%
- **Preferred field/category** — 20%
- **Location / remote** — 15%
- **Experience-level proximity** — 10%

It also returns human-readable **reasons** ("3 matching skills", "Remote-friendly"). The Career AI page additionally provides resume scoring, feedback, cover-letter generation, and interview questions (mock-generated for the demo).

---

## 12. Non-functional qualities

- **Responsive / mobile-first** — works from small phones to large desktops (Tailwind breakpoints).
- **Performance** — lazy loading + code splitting; each page is its own small bundle.
- **Loading & error states** — skeletons, spinners, empty states, and "not found" pages.
- **Type safety** — end-to-end TypeScript; forms validated with Zod.
- **Accessibility** — Radix UI primitives provide keyboard navigation and ARIA support.
- **Dark mode** — full light/dark theme support.

---

## 13. Running the project

```bash
# install dependencies
npm install

# start dev server (http://localhost:5173)
npm run dev

# type-check the codebase
npm run type-check

# production build (outputs to dist/)
npm run build

# preview the production build
npm run preview
```

### How to explore it
1. Run `npm run dev` and open `http://localhost:5173`.
2. Browse the public site (home, jobs, companies) without logging in.
3. Go to **Sign in** and pick a demo account (Candidate / Employer / Admin) to see each dashboard.

---

## 14. Quick mental model

> **`app/`** wires the app together (routing, layouts, global state).
> **`features/`** holds the actual product, one folder per domain.
> **`shared/`** holds reusable building blocks used everywhere.
> Data flows: **page → hook → api function → (mock data today / real server tomorrow)**.
> Access is gated by **role** via `ProtectedRoute`.

That's the whole project in a nutshell.

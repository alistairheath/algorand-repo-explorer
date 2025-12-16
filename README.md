# Algorand Repo Explorer

Algorand Repo Explorer is a React application that allows users to browse GitHub repositories from across the Algorand Ecosystem, view repository details, and save favorites for later. The app focuses on clarity, performance, ans simplified user experience. It was built as a practical demonstration of modern frontend architecture and data-handling patterns.

## View the App

A demo of the app is available at http://wkgc80848w4cwosg804s8k0c.167.99.92.196.sslip.io and is deployed via Coolify. Any updates to the main branch of this repo are automatically deployed via this pipeline.

![Image](public/screenshot_01.png)

## Run the App Locally

### Prerequisites
Before running the app locally, ensure you have the following installed:

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

You can verify your setup by running:
```bash
node -v
npm -v
git --version
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/alistairheath/algorand-repo-explorer.git
```

2. **Navigate into the project directory**
```bash
cd algorand-repo-explorer
```

3. **Install dependencies**
```bash
npm install
```

### Run the App

Start the development server:
```bash
npm run dev
```

Once running, the app will be available at:
```
http://localhost:5173
```

The development server supports hot reloading, so changes will appear instantly in the browser.

### Running Tests

**Unit tests (Vitest):**
```bash
npm run test
```

**End-to-end tests (Playwright):**
```bash
npm run test:e2e
```

⚠️ Ensure the dev server is running before executing Playwright tests.

## Additional Notes

### 1. Tech Stack & Tooling
The app is built with **Vite, React, and TypeScript** for fast development and strong type safety. **Tailwind CSS with daisyUI** is used for rapid, consistent UI composition. **Vitest** and **Playwright** provide unit and end-to-end testing, respectively.

### 2. Project Structure & Architecture
The codebase follows a **feature-based architecture**, grouping pages, components, hooks, and state by domain. Shared utilities and services are isolated to keep business logic decoupled from UI concerns. This structure is designed to scale without increasing cognitive overhead.

### 3. App Shell & Routing
Routing is handled with **React Router**, using a shared layout that provides a persistent navigation bar and page container. Routes are defined declaratively and include dynamic paths for repository detail pages. This ensures predictable navigation and deep-linking support.

### 4. GitHub API Integration
All GitHub interactions are centralized in a typed API layer to ensure consistency and error handling. API responses are strongly typed, and custom error objects expose rate-limit and status information to the UI. This abstraction keeps components simple and resilient to API changes.

### 5. Repository List Page
The repository list page fetches and displays repositories using a client-side filtering pipeline for organization, language, search, and sorting. Search input is debounced to reduce unnecessary computations. Pagination is handled incrementally to balance performance and usability.

### 6. UI Design & Interaction Patterns
Algroand Ecosystem Explorer has been created with a multiple devices in mind; responsive design patterns means the app works well on desktops, tablets and phones.

Repositories are presented as fully clickable cards with clear hover and focus affordances. Filters are implemented using responsive chip-based controls and flexible layout patterns. daisyUI components ensure consistent styling while keeping markup readable. Additionally, the primary and secondary colors have been set to match the colour scheme used by the Algorand Foundation.

### 7. Repository Detail Page
The detail page uses dynamic routing to load repository metadata and README content. README files are rendered using **react-markdown**, with custom component styling for readability. The page includes clear loading, error, and empty states for robustness.

### 8. Favorites Feature
Favorites are managed using **Zustand**, providing a lightweight global store with persistence. Users can add or remove repositories from favorites directly from list or detail views. Favorites are stored locally and remain available across sessions.

### 9. Caching Strategy
The app uses **IndexedDB via localforage** to cache GitHub API responses with configurable TTLs. A cache-first strategy minimizes API calls and improves perceived performance. Cache invalidation and forced refresh mechanisms are supported for development and debugging.

### 10. Testing Strategy
Unit tests are written with **Vitest** for utilities, cache logic, and state management. API behavior is tested using mocked network calls to avoid reliance on external services. A single **Playwright** end-to-end test validates the core user journey without introducing brittle test suites. Further E2E test could be written with playright to test additional functionality.

### 11. Performance & UX Considerations
The app prioritizes perceived performance through caching, debounced inputs, and memoized computations. UI states are designed to remain responsive even under rate limits or offline conditions. Over-engineering was intentionally avoided in favor of maintainable, understandable patterns.

### 12. Deployment

The app is deployed via Coolify to http://wkgc80848w4cwosg804s8k0c.167.99.92.196.sslip.io. Coolify has been used as the CI/CD pipeline to achieve this. It listens to changes on the main branch and then runs the build command to deploy it to our server.

### 13. Known Limitations & Future Improvements
The app currently uses unauthenticated GitHub requests and is subject to public rate limits. Server-side pagination and authenticated requests could further improve scalability. Additional enhancements could include PWA support or virtualized lists for very large datasets.

### 14. Key Learnings & Takeaways
This project reinforced the value of clear data boundaries, minimal global state, and intentional caching. Splitting side effects by responsibility significantly improved maintainability. The result is a performant, readable codebase that balances simplicity with real-world robustness.

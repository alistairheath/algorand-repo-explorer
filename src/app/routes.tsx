import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../shared/components/Layout";
import RepoListPage from "../features/repositories/pages/RepoListPage";
import RepoDetailPage from "../features/repositories/pages/RepoDetailPage";
import FavoritesPage from "../features/favorites/pages/FavoritesPage";

// Define the routes for the application
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/repos" replace /> },
      { path: "/repos", element: <RepoListPage /> },
      { path: "/repos/:owner/:name", element: <RepoDetailPage /> },
      { path: "/favorites", element: <FavoritesPage /> },
    ],
  },
]);

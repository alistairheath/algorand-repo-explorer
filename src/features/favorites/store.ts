import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GitHubRepo } from "../../services/github/types";

type FavoritesState = {
  // key by full_name for easy de-dupe
  favorites: Record<string, GitHubRepo>;

  add: (repo: GitHubRepo) => void;
  remove: (fullName: string) => void;
  toggle: (repo: GitHubRepo) => void;

  isFavorite: (fullName: string) => boolean;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},

      add: (repo) =>
        set((s) => ({
          favorites: { ...s.favorites, [repo.full_name]: repo },
        })),

      remove: (fullName) =>
        set((s) => {
          const next = { ...s.favorites };
          delete next[fullName];
          return { favorites: next };
        }),

      toggle: (repo) => {
        const exists = get().favorites[repo.full_name];
        if (exists) get().remove(repo.full_name);
        else get().add(repo);
      },

      isFavorite: (fullName) => Boolean(get().favorites[fullName]),

      clear: () => set({ favorites: {} }),
    }),
    {
      name: "algorand-repo-explorer:favorites",
      version: 1,
    }
  )
);

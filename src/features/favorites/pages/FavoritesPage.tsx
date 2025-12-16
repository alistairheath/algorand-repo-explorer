import { useMemo } from "react";
import { useFavoritesStore } from "../store";
import RepoCard from "../../repositories/components/RepoCard";

export default function FavoritesPage() {
  const favoritesMap = useFavoritesStore((s) => s.favorites);

  const favorites = useMemo(() => {
    return Object.values(favoritesMap)
      .slice()
      .sort((a, b) => a.full_name.localeCompare(b.full_name));
  }, [favoritesMap]);

  return (
    <div className="space-y-4 min-h-full">
      <div className="my-8">
        <h1 className="text-2xl font-bold">❤️ Favorites</h1>
        <p className="opacity-70 text-sm">Repositories you’ve saved for quick access.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="alert min-h-50 flex items-center justify-center flex-col gap-4 text-center">
          <span className="text-3xl">😢</span>
          <span className="text-md">You haven't added any repos to your favorites yet. Keep browsing and find something you like!</span>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {favorites.map((repo) => (
            <RepoCard key={repo.full_name} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}

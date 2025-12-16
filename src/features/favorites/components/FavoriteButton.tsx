import { useFavoritesStore } from "../store";

export default function FavoriteButton({
  fullName,
  repoForToggle,
  size = "md",
}: {
  fullName: string;
  repoForToggle: any;
  size?: "sm" | "md";
}) {
  const isFav = useFavoritesStore((s) => s.isFavorite(fullName));
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <button
      type="button"
      className={`btn  btn-ghost aspect-square my-auto ${size === "sm" ? "btn-sm" : "btn-md"}`}
      onClick={(e) => {
        e.stopPropagation(); // This prevents card click navigation.
        toggle(repoForToggle);
      }}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      {isFav ? "❤️" : "🩶"}
    </button>
  );
}

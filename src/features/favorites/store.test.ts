import { describe, it, expect, beforeEach } from "vitest";
import { useFavoritesStore } from "./store";

const mockRepo = {
  id: 1,
  full_name: "test/repo",
} as any;

beforeEach(() => {
  useFavoritesStore.getState().clear();
});

describe("favorites store", () => {
  it("adds a repo", () => {
    useFavoritesStore.getState().add(mockRepo);
    expect(useFavoritesStore.getState().isFavorite("test/repo")).toBe(true);
  });

  it("removes a repo", () => {
    useFavoritesStore.getState().add(mockRepo);
    useFavoritesStore.getState().remove("test/repo");
    expect(useFavoritesStore.getState().isFavorite("test/repo")).toBe(false);
  });

  it("toggles correctly", () => {
    const store = useFavoritesStore.getState();
    store.toggle(mockRepo);
    expect(store.isFavorite("test/repo")).toBe(true);
    store.toggle(mockRepo);
    expect(store.isFavorite("test/repo")).toBe(false);
  });
});

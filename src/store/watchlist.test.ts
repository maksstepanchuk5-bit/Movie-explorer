import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MovieListItem } from "../types/movie";

const movie: MovieListItem = {
  id: 1,
  title: "Test Movie",
  poster_path: "/poster.jpg",
  release_date: "2026-01-01",
  vote_average: 8.2,
};

async function loadStore() {
  vi.resetModules();
  const module = await import("./watchlist");
  return module.useWatchlist;
}

describe("useWatchlist", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("starts with an empty watchlist when localStorage is empty", async () => {
    const useWatchlist = await loadStore();

    expect(useWatchlist.getState().watchlist).toEqual([]);
  });

  it("loads saved movies from localStorage", async () => {
    localStorage.setItem("watchlist", JSON.stringify([movie]));

    const useWatchlist = await loadStore();

    expect(useWatchlist.getState().watchlist).toEqual([movie]);
  });

  it("adds a movie and saves it to localStorage", async () => {
    const useWatchlist = await loadStore();

    useWatchlist.getState().add(movie);

    expect(useWatchlist.getState().watchlist).toEqual([movie]);
    expect(JSON.parse(localStorage.getItem("watchlist") ?? "[]")).toEqual([movie]);
  });

  it("does not add the same movie twice", async () => {
    const useWatchlist = await loadStore();

    useWatchlist.getState().add(movie);
    useWatchlist.getState().add(movie);

    expect(useWatchlist.getState().watchlist).toHaveLength(1);
  });

  it("removes a movie and updates localStorage", async () => {
    const useWatchlist = await loadStore();

    useWatchlist.getState().add(movie);
    useWatchlist.getState().remove(movie.id);

    expect(useWatchlist.getState().watchlist).toEqual([]);
    expect(JSON.parse(localStorage.getItem("watchlist") ?? "[]")).toEqual([]);
  });
});


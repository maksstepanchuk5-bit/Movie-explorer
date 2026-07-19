import type { AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  api,
  getMovieDetails,
  getPopularMovies,
  searchMovies,
  TmdbApiError,
} from "./tmdb";

describe("tmdb api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns popular movies", async () => {
    const response = {
      page: 1,
      results: [
        {
          id: 1,
          title: "Test Movie",
          poster_path: "/poster.jpg",
          release_date: "2026-01-01",
          vote_average: 8.2,
        },
      ],
      total_pages: 10,
      total_results: 100,
    };

    vi.spyOn(api, "get").mockResolvedValueOnce(
      { data: response } as AxiosResponse<typeof response>,
    );

    await expect(getPopularMovies(1)).resolves.toEqual(response);
    expect(api.get).toHaveBeenCalledOnce();
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining("/movie/popular"),
    );
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("page=1"));
  });

  it("encodes the search query and returns results", async () => {
    const response = {
      page: 2,
      results: [],
      total_pages: 2,
      total_results: 0,
    };

    vi.spyOn(api, "get").mockResolvedValueOnce(
      { data: response } as AxiosResponse<typeof response>,
    );

    await expect(searchMovies("star wars", 2)).resolves.toEqual(response);
    expect(api.get).toHaveBeenCalledOnce();
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining("/search/movie"),
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining("query=star%20wars"),
    );
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("page=2"));
  });

  it("returns movie details", async () => {
    const movie = {
      id: 1,
      title: "Test Movie",
      poster_path: "/poster.jpg",
      release_date: "2026-01-01",
      vote_average: 8.2,
      runtime: 120,
      overview: "Overview",
      genres: [{ id: 1, name: "Drama" }],
    };

    vi.spyOn(api, "get").mockResolvedValueOnce(
      { data: movie } as AxiosResponse<typeof movie>,
    );

    await expect(getMovieDetails(1)).resolves.toEqual(movie);
    expect(api.get).toHaveBeenCalledOnce();
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("/movie/1"));
  });

  it("wraps a network error in TmdbApiError", async () => {
    vi.spyOn(api, "get").mockRejectedValueOnce({
      isAxiosError: true,
      response: undefined,
    });

    const promise = getPopularMovies();

    await expect(promise).rejects.toBeInstanceOf(TmdbApiError);
    await expect(promise).rejects.toThrow(
      "Could not reach the movie service. Check your internet connection.",
    );
  });

  it("returns a configuration message for status 401", async () => {
    vi.spyOn(api, "get").mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 401 },
    });

    await expect(getPopularMovies()).rejects.toThrow(
      "Movie service is not configured correctly. Please try again later.",
    );
  });

  it("returns movie not found for status 404", async () => {
    vi.spyOn(api, "get").mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404 },
    });

    await expect(getMovieDetails(999999)).rejects.toThrow("Movie not found.");
  });

  it("returns a friendly message for status 429", async () => {
    vi.spyOn(api, "get").mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 429 },
    });

    await expect(searchMovies("batman")).rejects.toThrow(
      "Too many requests. Please wait a moment and try again.",
    );
  });

  it("returns a temporary outage message for server errors", async () => {
    vi.spyOn(api, "get").mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500 },
    });

    await expect(getPopularMovies()).rejects.toThrow(
      "Movie service is temporarily unavailable. Please try again later.",
    );
  });

  it("returns a fallback message for other Axios statuses", async () => {
    vi.spyOn(api, "get").mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 400 },
    });

    await expect(getPopularMovies()).rejects.toThrow(
      "Could not load movies. Please try again later.",
    );
  });

  it("wraps a non-Axios error", async () => {
    vi.spyOn(api, "get").mockRejectedValueOnce(new Error("unexpected"));

    await expect(getPopularMovies()).rejects.toThrow(
      "Something went wrong. Please try again.",
    );
  });
});
import axios from "axios";
import type { MovieDetails, MovieListResponse } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export class TmdbApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TmdbApiError";
  }
}

function toTmdbApiError(error: unknown): TmdbApiError {
  if (!axios.isAxiosError(error)) {
    return new TmdbApiError("Something went wrong. Please try again.");
  }

  if (!error.response) {
    return new TmdbApiError(
      "Could not reach the movie service. Check your internet connection.",
    );
  }

  const status = error.response.status;

  if (status === 401 || status === 403) {
    return new TmdbApiError(
      "Movie service is not configured correctly. Please try again later.",
    );
  }

  if (status === 404) {
    return new TmdbApiError("Movie not found.");
  }

  if (status === 429) {
    return new TmdbApiError(
      "Too many requests. Please wait a moment and try again.",
    );
  }

  if (status >= 500) {
    return new TmdbApiError(
      "Movie service is temporarily unavailable. Please try again later.",
    );
  }

  return new TmdbApiError("Could not load movies. Please try again later.");
}

async function request<T>(url: string): Promise<T> {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch (error) {
    throw toTmdbApiError(error);
  }
}

export const getPopularMovies = (page = 1) =>
  request<MovieListResponse>(
    `/movie/popular?api_key=${API_KEY}&page=${page}`,
  );

export const searchMovies = (query: string, page = 1) =>
  request<MovieListResponse>(
    `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
  );

export const getMovieDetails = (id: number) =>
  request<MovieDetails>(`/movie/${id}?api_key=${API_KEY}`);


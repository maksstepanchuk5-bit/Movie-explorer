import axios from "axios";
import type { MovieDetails, MovieListResponse } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export class TmdbApiError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "TmdbApiError";
  }
}

type RequestOptions = {
  notFoundMessage?: string;
};

function toTmdbApiError(
  error: unknown,
  options?: RequestOptions,
): TmdbApiError {
  const createError = (message: string) =>
    new TmdbApiError(message, { cause: error });

  if (!axios.isAxiosError(error)) {
    return createError("Something went wrong. Please try again.");
  }

  if (!error.response) {
    return createError(
      "Could not reach the movie service. Check your internet connection.",
    );
  }

  const status = error.response.status;

  if (status === 401 || status === 403) {
    return createError(
      "Movie service is not configured correctly. Please try again later.",
    );
  }

  if (status === 404 && options?.notFoundMessage) {
    return createError(options.notFoundMessage);
  }

  if (status === 429) {
    return createError(
      "Too many requests. Please wait a moment and try again.",
    );
  }

  if (status >= 500) {
    return createError(
      "Movie service is temporarily unavailable. Please try again later.",
    );
  }

  return createError("Could not load movies. Please try again later.");
}

async function request<T>(url: string, options?: RequestOptions): Promise<T> {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch (error) {
    throw toTmdbApiError(error, options);
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
  request<MovieDetails>(`/movie/${id}?api_key=${API_KEY}`, {
    notFoundMessage: "Movie not found.",
  });


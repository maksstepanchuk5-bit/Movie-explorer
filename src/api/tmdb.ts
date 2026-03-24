import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export const getPopularMovies = (page = 1) =>
  api.get(`/movie/popular?api_key=${API_KEY}&page=${page}`);

export const searchMovies = (query: string) =>
  api.get(`/search/movie?api_key=${API_KEY}&query=${query}`);

export const getMovieDetails = (id: number) =>
  api.get(`/movie/${id}?api_key=${API_KEY}`);


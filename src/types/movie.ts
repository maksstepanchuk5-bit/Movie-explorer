/** Minimal movie shape for list cards (TMDB list items) */
export type MovieListItem = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

export type Genre = {
  id: number;
  name: string;
};

export type MovieDetails = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  runtime?: number | null;
  overview?: string;
  genres?: Genre[];
};
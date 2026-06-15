import { memo, useState } from "react";
import { useWatchlist } from "../store/watchlist";
import { Link } from "react-router-dom";
import type { MovieListItem } from "../types/movie";

type Props = {
  movie: MovieListItem;
};

const MovieCard = memo(function MovieCard({ movie }: Props) {
  const { add, remove, watchlist } = useWatchlist();
  const isSaved = watchlist.some((m) => m.id === movie.id);
  const [failedPosterKeys, setFailedPosterKeys] = useState<Set<string>>(() => new Set());
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null;
  const posterKey = `${movie.id}:${posterUrl ?? ""}`;
  const posterAlt = movie.title;
  const showPoster = Boolean(posterUrl) && !failedPosterKeys.has(posterKey);
  const ratingLabel = movie.vote_average != null ? movie.vote_average.toFixed(1) : "—";

  return (
    <article className="movie-card">
      <div className="movie-card-media">
        {showPoster ? (
          <img
            className="movie-card-poster"
            src={posterUrl ?? undefined}
            alt={posterAlt}
            loading="lazy"
            decoding="async"
            onError={() =>
              setFailedPosterKeys((prev) => new Set(prev).add(posterKey))
            }
          />
        ) : (
          <div className="movie-card-poster movie-card-poster-fallback" role="img" aria-label={posterAlt}>
            {posterAlt}
          </div>
        )}
        <div className="movie-card-rating" aria-label={`Rating ${ratingLabel}`}>
          <span className="movie-card-rating-icon" aria-hidden="true">
            ★
          </span>
          <span>{ratingLabel}</span>
        </div>
      </div>
      <div className="movie-card-panel">
        <Link className="movie-card-title" to={`/movie/${movie.id}`}>
          <h3>{movie.title}</h3>
        </Link>
        <button
          type="button"
          className="movie-card-list-action"
          aria-pressed={isSaved}
          onClick={() => (isSaved ? remove(movie.id) : add(movie))}
        >
          <span className="movie-card-list-icon" aria-hidden="true">
            {isSaved ? "×" : "+"}
          </span>
          {isSaved ? "Remove from my watchlist" : "Add to my watchlist"}
        </button>
      </div>
    </article>
  );
});

export default MovieCard;

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
  const [failedPosterSrc, setFailedPosterSrc] = useState<string | null>(null);
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null;
  const posterAlt = movie.title;
  const showPoster = Boolean(posterUrl) && failedPosterSrc !== posterUrl;

  return (
    <article className="movie-card">
      {showPoster ? (
        <img
          className="movie-card-poster"
          src={posterUrl ?? undefined}
          alt={posterAlt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedPosterSrc(posterUrl)}
        />
      ) : (
        <div className="movie-card-poster movie-card-poster-fallback" role="img" aria-label={posterAlt}>
          {posterAlt}
        </div>
      )}
      <div className="movie-card-body">
        <Link className="movie-card-title" to={`/movie/${movie.id}`}>
          <h3>{movie.title}</h3>
        </Link>
        <p className="movie-card-meta">{movie.release_date?.slice(0, 4) ?? "—"}</p>
        <p className="movie-card-meta">Rating {movie.vote_average?.toFixed(1) ?? "—"}</p>
        <div className="movie-card-actions">
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => (isSaved ? remove(movie.id) : add(movie))}
          >
            {isSaved ? "Remove" : "Watchlist"}
          </button>
        </div>
      </div>
    </article>
  );
});

export default MovieCard;

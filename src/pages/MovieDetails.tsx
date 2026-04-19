import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../api/tmdb";

function DetailsSkeleton() {
  return (
    <div className="detail-layout skeleton-hero" aria-busy="true" aria-label="Loading movie">
      <div className="skeleton skeleton-poster" />
      <div>
        <div className="skeleton skeleton-block" style={{ height: 28, maxWidth: "70%" }} />
        <div className="skeleton skeleton-block short" />
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block" />
      </div>
    </div>
  );
}

function MovieDetails() {
  const { id } = useParams();
  const numericId = Number(id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(numericId),
    enabled: Number.isFinite(numericId) && numericId > 0,
  });

  if (!id || !Number.isFinite(numericId) || numericId <= 0) {
    return (
      <div className="page-stack">
        <div className="inline-error" role="alert">
          Invalid movie link.
        </div>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-stack">
        <DetailsSkeleton />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="page-stack">
        <div className="inline-error" role="alert">
          {error instanceof Error ? error.message : "Could not load this movie."}
        </div>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  const movie = data.data;
  const posterSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="page-stack">
      <div className="detail-layout">
        <img
          className="detail-poster"
          src={posterSrc}
          alt={movie.title}
          loading="eager"
          decoding="async"
        />
        <div className="detail-body">
          <h1 className="page-title detail-title">{movie.title}</h1>
          <div className="detail-meta">
            <span>{movie.release_date?.slice(0, 4) ?? "—"}</span>
            {movie.runtime != null && movie.runtime > 0 && (
              <span>{movie.runtime} min</span>
            )}
            <span>★ {movie.vote_average?.toFixed(1) ?? "—"}</span>
          </div>
          {movie.genres && movie.genres.length > 0 && (
            <p className="muted genres-line">
              {movie.genres.map((g) => g.name).join(" · ")}
            </p>
          )}
          <p>{movie.overview || "No overview available."}</p>
          <Link className="nav-link link-inline" to="/">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;

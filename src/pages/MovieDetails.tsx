import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
  const [failedPosterSrc, setFailedPosterSrc] = useState<string | null>(null);

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
  const posterSrc = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  const posterAlt = movie.title;
  const showPoster = Boolean(posterSrc) && failedPosterSrc !== posterSrc;

  return (
    <div className="page-stack">
      <div className="detail-layout">
        {showPoster ? (
          <img
            className="detail-poster"
            src={posterSrc ?? undefined}
            alt={posterAlt}
            loading="eager"
            decoding="async"
            onError={() => setFailedPosterSrc(posterSrc)}
          />
        ) : (
          <div className="detail-poster detail-poster-fallback" role="img" aria-label={posterAlt}>
            {posterAlt}
          </div>
        )}
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

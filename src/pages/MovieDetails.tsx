import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { getMovieDetails } from "../api/tmdb";
import { PosterPlaceholder } from "../components/PosterPlaceholder";
import { WatchlistToggle } from "../components/WatchlistToggle";
import type { MovieListItem } from "../types/movie";
import "../styles/movie-details-page.css";

function MovieDetailsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="movie-details-page">
      <div className="movie-details-page-inner">{children}</div>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="detail-layout" aria-busy="true" aria-label="Loading movie">
      <div className="skeleton detail-skeleton-poster" />
      <div className="detail-skeleton-body">
        <div className="skeleton skeleton-block detail-skeleton-title" />
        <div className="skeleton skeleton-block detail-skeleton-meta" />
        <div className="skeleton skeleton-block detail-skeleton-toggle" />
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block short" />
      </div>
    </div>
  );
}

function MovieDetailsState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="detail-layout detail-layout--state">
      <div className="movie-details-state">
        <div className="inline-error" role="alert">
          {message}
        </div>
        <Link className="movie-details-back-link" to="/">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

function toWatchlistMovie(movie: {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
}): MovieListItem {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  };
}

function MovieDetails() {
  const { id } = useParams();
  const numericId = Number(id);
  const [failedPosterKeys, setFailedPosterKeys] = useState<Set<string>>(() => new Set());

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(numericId),
    enabled: Number.isFinite(numericId) && numericId > 0,
  });

  if (!id || !Number.isFinite(numericId) || numericId <= 0) {
    return (
      <MovieDetailsLayout>
        <MovieDetailsState message="Invalid movie link." />
      </MovieDetailsLayout>
    );
  }

  if (isLoading) {
    return (
      <MovieDetailsLayout>
        <DetailsSkeleton />
      </MovieDetailsLayout>
    );
  }

  if (isError || !data?.data) {
    return (
      <MovieDetailsLayout>
        <MovieDetailsState
          message={
            error instanceof Error ? error.message : "Could not load this movie."
          }
        />
      </MovieDetailsLayout>
    );
  }
  const movie = data.data;
  const posterSrc = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  const posterKey = `${movie.id}:${posterSrc ?? ""}`;
  const posterAlt = movie.title;
  const showPoster = Boolean(posterSrc) && !failedPosterKeys.has(posterKey);

  return (
    <MovieDetailsLayout>
      <div className="detail-layout">
        {showPoster ? (
          <img
            className="detail-poster"
            src={posterSrc ?? undefined}
            alt={posterAlt}
            loading="eager"
            decoding="async"
            onError={() =>
              setFailedPosterKeys((prev) => new Set(prev).add(posterKey))
            }
          />
        ) : (
          <PosterPlaceholder className="detail-poster" label={posterAlt} />
        )}
        <div className="detail-body">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            <span>{movie.release_date?.slice(0, 4) ?? "—"}</span>
            {movie.runtime != null && movie.runtime > 0 && (
              <span>{movie.runtime} min</span>
            )}
            <span>★ {movie.vote_average?.toFixed(1) ?? "—"}</span>
          </div>
          {movie.genres && movie.genres.length > 0 && (
            <p className="genres-line">
              {movie.genres.map((g) => g.name).join(" · ")}
            </p>
          )}
          <WatchlistToggle movie={toWatchlistMovie(movie)} />
          <p>{movie.overview || "No overview available."}</p>
          <Link className="movie-details-back-link" to="/">
            ← Back to home
          </Link>
        </div>
      </div>
    </MovieDetailsLayout>
  );}

export default MovieDetails;

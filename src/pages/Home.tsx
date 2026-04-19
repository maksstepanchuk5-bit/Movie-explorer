import { useInfiniteQuery } from "@tanstack/react-query";
import { getPopularMovies, searchMovies } from "../api/tmdb";
import { useState, useRef, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { useDebounce } from "../hooks/useDebounce";

function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading movies">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </div>
  );
}

function Home() {
  const [query, setQuery] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const debouncedQuery = useDebounce(query);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["movies", debouncedQuery],
      queryFn: ({ pageParam = 1 }) => {
        if (debouncedQuery) {
          return searchMovies(debouncedQuery);
        }
        return getPopularMovies(pageParam);
      },
      getNextPageParam: (_, allPages) => allPages.length + 1,
      initialPageParam: 1,
    });

  useEffect(() => {
    if (debouncedQuery) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, debouncedQuery]);

  const movies = data?.pages.flatMap((page) => page.data.results) ?? [];

  if (isLoading) {
    return (
      <div className="page-stack">
        <h1 className="page-title">Discover</h1>
        <div className="search-row">
          <input className="input" placeholder="Search movies…" disabled aria-disabled />
        </div>
        <HomeSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-stack">
        <h1 className="page-title">Discover</h1>
        <div className="inline-error" role="alert">
          {error instanceof Error ? error.message : "Could not load movies. Check your connection and API key."}
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <h1 className="page-title">Discover</h1>
      <p className="muted">
        Search TMDB or browse popular titles. Scroll to load more.
      </p>

      <div className="search-row">
        <input
          className="input"
          placeholder="Search movies…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search movies"
        />
      </div>

      {movies.length === 0 && (
        <div className="empty-state">
          <p>No results for your search. Try another title.</p>
        </div>
      )}

      {movies.length > 0 && (
        <div>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          <div ref={loadMoreRef} className="load-more-sentinel" />
          {isFetchingNextPage && <p className="end-hint">Loading more…</p>}
          {!debouncedQuery && !hasNextPage && !isFetchingNextPage && (
            <p className="end-hint">You&apos;ve reached the end.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;

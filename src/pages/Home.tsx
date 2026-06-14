import { useInfiniteQuery } from "@tanstack/react-query";
import { getPopularMovies, searchMovies } from "../api/tmdb";
import { useState, useRef, useEffect, type CSSProperties, type ReactNode } from "react";
import MovieCard from "../components/MovieCard";
import { useDebounce } from "../hooks/useDebounce";

function SearchIcon() {
  return (
    <svg
      className="home-search-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L17 17" strokeLinecap="round" />
    </svg>
  );
}

function HomeSkeleton() {
  return (
    <div className="movie-card-grid" aria-busy="true" aria-label="Loading movies">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </div>
  );
}

function BackgroundBlobTile({ index }: { index: number }) {
  return (
    <div
      className="home-page-bg-tile"
      style={{ "--tile-index": index } as CSSProperties}
    >
      <div className="home-page-bg-vector home-page-bg-vector--4" aria-hidden="true">
        <div className="home-page-bg-vector__glow home-page-bg-vector__glow--a">
          <img src="/figma-bg/vector4.svg" alt="" decoding="async" />
        </div>
      </div>
      <div className="home-page-bg-vector home-page-bg-vector--6" aria-hidden="true">
        <div className="home-page-bg-vector__glow home-page-bg-vector__glow--b">
          <img src="/figma-bg/vector6.svg" alt="" decoding="async" />
        </div>
      </div>
      <div className="home-page-bg-ellipse home-page-bg-ellipse--6" aria-hidden="true">
        <div className="home-page-bg-ellipse__rotate home-page-bg-ellipse__rotate--a">
          <div className="home-page-bg-ellipse__inner">
            <div className="home-page-bg-ellipse__glow home-page-bg-ellipse__glow--a">
              <img src="/figma-bg/ellipse6.svg" alt="" decoding="async" />
            </div>
          </div>
        </div>
      </div>
      <div className="home-page-bg-ellipse home-page-bg-ellipse--8" aria-hidden="true">
        <div className="home-page-bg-ellipse__rotate home-page-bg-ellipse__rotate--b">
          <div className="home-page-bg-ellipse__inner">
            <div className="home-page-bg-ellipse__glow home-page-bg-ellipse__glow--b">
              <img src="/figma-bg/ellipse8.svg" alt="" decoding="async" />
            </div>
          </div>
        </div>
      </div>
      <div className="home-page-bg-ellipse home-page-bg-ellipse--5" aria-hidden="true">
        <div className="home-page-bg-ellipse__rotate home-page-bg-ellipse__rotate--a">
          <div className="home-page-bg-ellipse__inner">
            <div className="home-page-bg-ellipse__glow home-page-bg-ellipse__glow--a">
              <img src="/figma-bg/ellipse5.svg" alt="" decoding="async" />
            </div>
          </div>
        </div>
      </div>
      <div className="home-page-bg-vector home-page-bg-vector--3" aria-hidden="true">
        <div className="home-page-bg-vector__glow home-page-bg-vector__glow--a">
          <img src="/figma-bg/vector3.svg" alt="" decoding="async" />
        </div>
      </div>
    </div>
  );
}

function getBackgroundTileHeightPx(): number {
  const w = Math.min(window.innerWidth, 1440);
  return (3192 * w) / 1440;
}

function HomePageBackground() {
  const [tileCount, setTileCount] = useState(2);

  useEffect(() => {
    const shell = document.querySelector(".app-shell--figma");
    if (!shell) return;

    const updateTileCount = () => {
      const tileHeight = getBackgroundTileHeightPx();
      if (tileHeight <= 0) return;

      const offsetY = (160 * Math.min(window.innerWidth, 1440)) / 1440;
      const shellHeight = shell.getBoundingClientRect().height;
      const needed = Math.ceil((shellHeight + offsetY) / tileHeight) + 1;
      setTileCount((prev) => (prev === needed ? prev : Math.max(2, needed)));
    };

    updateTileCount();

    const observer = new ResizeObserver(updateTileCount);
    observer.observe(shell);
    window.addEventListener("resize", updateTileCount);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTileCount);
    };
  }, []);

  return (
    <div className="home-page-bg" aria-hidden="true">
      {Array.from({ length: tileCount }, (_, index) => (
        <BackgroundBlobTile key={index} index={index} />
      ))}
    </div>
  );
}

function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="home-page">
      <div className="home-page-inner">
        <header className="home-hero">
          <h1 className="home-hero-title">Movie Explorer</h1>
          <p className="home-hero-text">
            Discover popular movies and build your personal watchlist. Search TMDB,
            explore titles, and save what you want to watch next.
          </p>
        </header>
        {children}
      </div>
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
          return searchMovies(debouncedQuery, pageParam);
        }
        return getPopularMovies(pageParam);
      },
      getNextPageParam: (lastPage) => {
        const { page, total_pages } = lastPage.data;
        return page < total_pages ? page + 1 : undefined;
      },
      initialPageParam: 1,
    });

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, debouncedQuery]);

  const movies = data?.pages.flatMap((page) => page.data.results) ?? [];
  const apiTotal = data?.pages[0]?.data?.total_results;
  const displayCount =
    debouncedQuery && apiTotal != null
      ? apiTotal
      : hasNextPage
        ? `${movies.length}+`
        : movies.length;

  const searchBlock = (
    <div className="home-search">
      <label className="home-search-field">
        <SearchIcon />
        <input
          className="home-search-input"
          type="search"
          placeholder="Search movies"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search movies"
        />
      </label>
    </div>
  );

  const sectionTitle = (
    <h2 className="home-section-title">
      All <span className="home-section-count">({isLoading ? "…" : displayCount})</span>
    </h2>
  );

  if (isLoading) {
    return (
      <HomeLayout>
        {searchBlock}
        {sectionTitle}
        <HomeSkeleton />
      </HomeLayout>
    );
  }

  if (error) {
    return (
      <HomeLayout>
        {searchBlock}
        <div className="inline-error" role="alert">
          {error instanceof Error ? error.message : "Could not load movies. Check your connection and API key."}
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      {searchBlock}
      {sectionTitle}

      {movies.length === 0 && (
        <div className="empty-state">
          <p>
            {debouncedQuery
              ? "No results for your search. Try another title."
              : "No movies to show right now. Try again later."}
          </p>
        </div>
      )}

      {movies.length > 0 && (
        <>
          <div className="movie-card-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div ref={loadMoreRef} className="load-more-sentinel" />
          {isFetchingNextPage && <p className="end-hint">Loading more…</p>}
          {!hasNextPage && !isFetchingNextPage && (
            <p className="end-hint">You&apos;ve reached the end.</p>
          )}
        </>
      )}
    </HomeLayout>
  );
}

export default Home;
export { HomePageBackground };

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPopularMovies, searchMovies } from "../api/tmdb";
import { useState, useRef, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { useDebounce } from "../hooks/useDebounce";


function Home() {
  const [query, setQuery] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const debouncedQuery = useDebounce(query);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({

    queryKey: ["movies", debouncedQuery],

    queryFn: ({ pageParam = 1 }) => {
        if(debouncedQuery) {
            return searchMovies(debouncedQuery)
        }
        return getPopularMovies(pageParam);},

      getNextPageParam: (_, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage;
     },
     initialPageParam: 1,
    });

  useEffect(() => {
    if(debouncedQuery) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
        }
        });
        if(loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }
        return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, debouncedQuery]);

  const movies = data?.pages.flatMap((page) => page.data.results) || [];
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>

  return (
    <div>
      <input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {movies.length === 0 && <div>No results</div>}

      <div>
        {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
         ))}
         <div ref={loadMoreRef} style={{ height: 50}} />
         {isFetchingNextPage && <p>Loading more...</p>}
      </div>

    </div>
  );
}

export default Home;
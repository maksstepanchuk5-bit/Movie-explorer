import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../api/tmdb";

function MovieDetails() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(Number(id)),
  });

  if (isLoading) return <div>Loading...</div>;

  const movie = data?.data;

  return (
    <div>
      <h1>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
      />
      <p>{movie.overview}</p>
      <p>⭐ {movie.vote_average}</p>
      <p>Release: {movie.release_date}</p>
    </div>
  );
}

export default MovieDetails;

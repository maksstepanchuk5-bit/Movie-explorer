import { useWatchlist } from "../store/watchlist";
import { Link } from "react-router-dom";


type Props = {
  movie: any;
};


const MovieCard = ({ movie }: Props) => {
    const { add, remove, watchlist } = useWatchlist();
    const isSaved = watchlist.some((m) => m.id === movie.id);
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : "https://via.placeholder.com/200x300?text=No+Image";
    return (
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ border: "solid 2px black", margin: 10, padding: 10}}>
        <button onClick={() => (isSaved ? remove(movie.id) : add(movie))} style={{ margin: 10}} >
            {isSaved ? "Remove" : "Add"}
        </button>
         <img
        src={posterUrl}
        alt={movie.title}
      />

      <Link to={`/movie/${movie.id}`}>
        <h3>{movie.title}</h3>
      </Link>

      <p>{movie.release_date?.slice(0, 4)}</p>
      <p>⭐ {movie.vote_average}</p>
    </div>
  );
};

export default MovieCard;
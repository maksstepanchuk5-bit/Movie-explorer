import { Link } from "react-router-dom";
import { useWatchlist } from "../store/watchlist";

function WatchlistPage() {
  const { watchlist } = useWatchlist();

  if (!watchlist.length) {
    return (
      <div className="page-stack">
        <h1 className="page-title">Watchlist</h1>
        <div className="empty-state">
          <p>No saved movies yet.</p>
          <p className="muted mt-8">
            Add titles from the home page to see them here.
          </p>
          <Link className="nav-link link-inline" to="/">
            Browse movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <h1 className="page-title">Watchlist</h1>
      <p className="muted">{watchlist.length} saved</p>
      <div>
        {watchlist.map((movie) => (
          <div key={movie.id} className="watchlist-row">
            <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WatchlistPage;

import { useWatchlist } from "../store/watchlist";
import type { MovieListItem } from "../types/movie";
import "../styles/watchlist-toggle.css";

type Props = {
  movie: MovieListItem;
};

function WatchlistAddIcon() {
  return (
    <svg
      className="watchlist-toggle__icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 12H18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WatchlistRemoveIcon() {
  return (
    <svg
      className="watchlist-toggle__icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.75781 7.75732L16.2431 16.2426"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75781 16.2426L16.2431 7.75732"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WatchlistToggle({ movie }: Props) {
  const { add, remove, watchlist } = useWatchlist();
  const isSaved = watchlist.some((m) => m.id === movie.id);

  return (
    <button
      type="button"
      className="watchlist-toggle"
      aria-pressed={isSaved}
      onClick={() => (isSaved ? remove(movie.id) : add(movie))}
    >
      {isSaved ? <WatchlistRemoveIcon /> : <WatchlistAddIcon />}
      <span className="watchlist-toggle__label">
        {isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
      </span>
    </button>
  );
}

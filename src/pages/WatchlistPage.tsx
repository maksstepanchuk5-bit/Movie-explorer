import { useWatchlist } from "../store/watchlist";

const WatchlistPage = () => {
    const {watchlist} = useWatchlist ();

    if (!watchlist.length) return <div>No movies yet</div>;

    return (
        <div>
            {watchlist.map((movie) => (
                <div key={movie.id}>{movie.title}</div>
            ))}
        </div>
    );
};

export default WatchlistPage
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WatchlistPage from "./pages/WatchlistPage";
import { Link } from "react-router-dom";
import MovieDetails from "./pages/MovieDetails";

function App() {
 return (
  <BrowserRouter>
  <nav style={{ margin: 10}}>
    <Link to="/">Home<br /></Link>
    <Link to="/watchlist">Watchlist</Link>
  </nav >
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/watchlist" element={<WatchlistPage />}/>
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  </BrowserRouter>
 )
}

export default App;
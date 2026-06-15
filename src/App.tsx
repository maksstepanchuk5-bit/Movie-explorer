import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes, useLocation } from "react-router-dom";
import Home, { HomePageBackground } from "./pages/Home";
import WatchlistPage from "./pages/WatchlistPage";
import MovieDetails from "./pages/MovieDetails";
import "./styles/home-page.css";

type Theme = "light" | "dark";

function readStoredTheme(): Theme | null {
  const v = localStorage.getItem("movie-explorer-theme");
  return v === "light" || v === "dark" ? v : null;
}

function AppShell() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("movie-explorer-theme", theme);
  }, [theme]);

  return (
    <div className={`app-shell${isHome ? " app-shell--figma" : ""}`}>
      {isHome && <HomePageBackground />}
      {isHome ? (
        <header className="figma-navbar">
          <div className="figma-navbar-inner">
            <NavLink className="figma-logo" to="/" end aria-label="Movie Explorer home">
              <img
                className="figma-logo-img"
                src="/movie-explorer-logo.svg"
                alt=""
                width={40}
                height={40}
                decoding="async"
              />
            </NavLink>
            <nav className="figma-nav" aria-label="Main">
              <NavLink className="figma-nav-link" to="/" end>
                Movies
              </NavLink>
              <button
                type="button"
                className="figma-nav-link figma-nav-theme"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                aria-label="Toggle color theme"
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button>
              <NavLink className="figma-nav-link" to="/watchlist">
                Watchlist
              </NavLink>
            </nav>
          </div>
        </header>
      ) : (
        <header className="topbar">
          <NavLink className="brand" to="/" end>
            Movie Explorer
          </NavLink>
          <nav className="nav" aria-label="Main">
            <NavLink className="nav-link" to="/" end>
              Home
            </NavLink>
            <NavLink className="nav-link" to="/watchlist">
              Watchlist
            </NavLink>
          </nav>
          <div className="topbar-actions">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </header>
      )}

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;

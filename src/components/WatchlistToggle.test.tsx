import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import type { MovieListItem } from "../types/movie";

const movie: MovieListItem = {
    id: 1,
    title: "Test Movie",
    poster_path: "/poster.jpg",
    release_date: "2026-01-01",
    vote_average: 8.2,
};

async function loadComponent() {
    vi.resetModules();
    const module = await import("./WatchlistToggle");
    return module.WatchlistToggle;
};

describe("WatchlistToggle", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("shows Add to Watchlist when movie is not saved", async ()=> {
        const WatchlistToggle = await loadComponent();

        render(<WatchlistToggle movie={movie} />);

        const button = screen.getByRole("button", { name: /add to watchlist/i });
        expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("adds a movie when clicked", async () => {
        const user = userEvent.setup();
        const WatchlistToggle = await loadComponent();

        render(<WatchlistToggle movie={movie} />);

        await user.click(screen.getByRole("button", {name: /add to watchlist/i }));

        expect(screen.getByRole("button", { name: /remove from watchlist/i })).toHaveAttribute(
            "aria-pressed",
            "true",);

        expect(JSON.parse(localStorage.getItem("watchlist") ?? "[]")).toEqual([movie]);
    });

    it("removes a saved movie when clicked", async () => {
        localStorage.setItem("watchlist", JSON.stringify([movie]));
        const user = userEvent.setup();
        const WatchlistToggle = await loadComponent();

        render(<WatchlistToggle movie={movie} />);

        await user.click(screen.getByRole("button", { name: /remove from watchlist/i}));

        expect(screen.getByRole("button", { name: /add to watchlist/i })).toHaveAttribute(
            "aria-pressed",
            "false",);

        expect(JSON.parse(localStorage.getItem("watchlist") ?? "[]")).toEqual([]);
    });

    it("uses inline labels and hides the SVG icon for the inline variant", async () => {
        const WatchlistToggle = await loadComponent();

        render(<WatchlistToggle movie={movie} variant="inline" />);

        expect(screen.getByRole("button", { name: /\+ add to watchlist/i })).toBeInTheDocument();

        expect(document.querySelector(".watchlist-toggle__icon")).not.toBeInTheDocument();
    });
});

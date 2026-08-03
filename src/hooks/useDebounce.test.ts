import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
      });
    
    it("returns the initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("batman"));
        expect(result.current).toBe("batman");
    });

    it("does not update the value before the delay", () => {
        const { result, rerender } = renderHook(
            ({value}) => useDebounce(value, 500),
            { initialProps: { value: "batman"} }
        );

        rerender({ value: "joker" });

        expect(result.current).toBe("batman");
    });

    it("updates the value after the delay", () => {
        const { result, rerender } = renderHook(
            ({value}) => useDebounce(value, 500),
            { initialProps: { value: "batman"}}
        );

        rerender({ value: "joker" });
        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(result.current).toBe("joker");
    });

    it("uses only the latest value when value changes quickly", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: "batman"}}
        );

        rerender({ value: "joker"});
        
        act(() => {
            vi.advanceTimersByTime(300);
        });

        rerender({ value: "bane"});

        act(() => {
            vi.advanceTimersByTime(499);
        });

        expect(result.current).toBe("batman");

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(result.current).toBe("bane");
    });
});
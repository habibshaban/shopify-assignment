import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useOptState } from "./use-opt-state";

describe("useOptState", () => {
  describe("initialization", () => {
    it("initializes with empty values for given length", () => {
      const { result } = renderHook(() => useOptState({ length: 6 }));

      expect(result.current.value).toHaveLength(6);
      expect(result.current.value.every((v) => v === "")).toBe(true);
    });

    it("initializes with controlled value", () => {
      const { result } = renderHook(() => useOptState({ length: 6, value: "123456" }));

      expect(result.current.value).toEqual(["1", "2", "3", "4", "5", "6"]);
    });

    it("pads controlled value with empty strings if shorter than length", () => {
      const { result } = renderHook(() => useOptState({ length: 6, value: "123" }));

      expect(result.current.value).toEqual(["1", "2", "3", "", "", ""]);
    });

    it("truncates controlled value if longer than length", () => {
      const { result } = renderHook(() => useOptState({ length: 4, value: "123456" }));

      expect(result.current.value).toEqual(["1", "2", "3", "4"]);
    });
  });

  describe("validation", () => {
    it("returns numeric validation by default", () => {
      const { result } = renderHook(() => useOptState({ length: 6 }));

      expect(result.current.validation).toEqual({
        regexp: /[^\d]/g,
        pattern: "\\d{1}",
        inputMode: "numeric",
      });
    });

    it("returns alpha validation when validationType is alpha", () => {
      const { result } = renderHook(() => useOptState({ length: 6, validationType: "alpha" }));

      expect(result.current.validation).toEqual({
        regexp: /[^a-zA-Z]/g,
        pattern: "[a-zA-Z]{1}",
        inputMode: "text",
      });
    });

    it("returns alphanumeric validation when validationType is alphanumeric", () => {
      const { result } = renderHook(() =>
        useOptState({ length: 6, validationType: "alphanumeric" })
      );

      expect(result.current.validation).toEqual({
        regexp: /[^a-zA-Z0-9]/g,
        pattern: "[a-zA-Z0-9]{1}",
        inputMode: "text",
      });
    });

    it("returns null validation when validationType is none", () => {
      const { result } = renderHook(() => useOptState({ length: 6, validationType: "none" }));

      expect(result.current.validation).toBeNull();
    });
  });

  describe("setCharAtIndex", () => {
    it("sets character at specified index", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useOptState({ length: 6, onChange }));

      act(() => {
        result.current.setCharAtIndex(0, "1");
      });

      expect(result.current.value[0]).toBe("1");
      expect(onChange).toHaveBeenCalledWith("1");
    });

    it("rejects non-numeric characters with numeric validation", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useOptState({ length: 6, onChange, validationType: "numeric" })
      );

      act(() => {
        result.current.setCharAtIndex(0, "a");
      });

      expect(result.current.value[0]).toBe("");
      expect(onChange).not.toHaveBeenCalled();
    });

    it("rejects non-alpha characters with alpha validation", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useOptState({ length: 6, onChange, validationType: "alpha" })
      );

      act(() => {
        result.current.setCharAtIndex(0, "1");
      });

      expect(result.current.value[0]).toBe("");
      expect(onChange).not.toHaveBeenCalled();
    });

    it("accepts alphanumeric characters with alphanumeric validation", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useOptState({ length: 6, onChange, validationType: "alphanumeric" })
      );

      act(() => {
        result.current.setCharAtIndex(0, "a");
      });

      expect(result.current.value[0]).toBe("a");

      act(() => {
        result.current.setCharAtIndex(1, "1");
      });

      expect(result.current.value[1]).toBe("1");
    });

    it("accepts any character with no validation", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useOptState({ length: 6, onChange, validationType: "none" })
      );

      act(() => {
        result.current.setCharAtIndex(0, "@");
      });

      expect(result.current.value[0]).toBe("@");
      expect(onChange).toHaveBeenCalledWith("@");
    });

    it("calls onComplete when all characters are filled", () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() => useOptState({ length: 4, onComplete }));

      act(() => {
        result.current.setCharAtIndex(0, "1");
      });
      act(() => {
        result.current.setCharAtIndex(1, "2");
      });
      act(() => {
        result.current.setCharAtIndex(2, "3");
      });

      expect(onComplete).not.toHaveBeenCalled();

      act(() => {
        result.current.setCharAtIndex(3, "4");
      });

      expect(onComplete).toHaveBeenCalledWith("1234");
    });
  });

  describe("clearCharAtIndex", () => {
    it("clears character at specified index", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useOptState({ length: 6, onChange, value: "123456" }));

      act(() => {
        result.current.clearCharAtIndex(2, false);
      });

      expect(onChange).toHaveBeenCalledWith("12456");
    });

    it("clears previous character when current is empty and movePrevious is true", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useOptState({ length: 6, onChange }));

      // Set first two characters
      act(() => {
        result.current.setCharAtIndex(0, "1");
        result.current.setCharAtIndex(1, "2");
      });

      // Clear at index 2 (which is empty), should clear index 1
      act(() => {
        result.current.clearCharAtIndex(2, true);
      });

      expect(result.current.value[1]).toBe("");
    });
  });

  describe("clearAll", () => {
    it("clears all characters", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useOptState({ length: 6, onChange }));

      act(() => {
        result.current.setCharAtIndex(0, "1");
        result.current.setCharAtIndex(1, "2");
        result.current.setCharAtIndex(2, "3");
      });

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.value.every((v) => v === "")).toBe(true);
      expect(onChange).toHaveBeenLastCalledWith("");
    });
  });

  describe("handlePaste", () => {
    it("handles paste of valid characters", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useOptState({ length: 6, onChange }));

      act(() => {
        result.current.handlePaste("123456");
      });

      expect(result.current.value).toEqual(["1", "2", "3", "4", "5", "6"]);
      expect(onChange).toHaveBeenCalledWith("123456");
    });

    it("truncates pasted value to length", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useOptState({ length: 4, onChange }));

      act(() => {
        result.current.handlePaste("123456");
      });

      expect(result.current.value).toEqual(["1", "2", "3", "4"]);
      expect(onChange).toHaveBeenCalledWith("1234");
    });

    it("filters invalid characters when pasting with numeric validation", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useOptState({ length: 6, onChange, validationType: "numeric" })
      );

      act(() => {
        result.current.handlePaste("1a2b3c");
      });

      expect(result.current.value).toEqual(["1", "2", "3", "", "", ""]);
      expect(onChange).toHaveBeenCalledWith("123");
    });

    it("filters invalid characters when pasting with alpha validation", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useOptState({ length: 6, onChange, validationType: "alpha" })
      );

      act(() => {
        result.current.handlePaste("a1b2c3");
      });

      expect(result.current.value).toEqual(["a", "b", "c", "", "", ""]);
      expect(onChange).toHaveBeenCalledWith("abc");
    });
  });

  describe("getFirstEmptyIndex", () => {
    it("returns index of first empty slot", () => {
      const { result } = renderHook(() => useOptState({ length: 6 }));

      act(() => {
        result.current.setCharAtIndex(0, "1");
      });
      act(() => {
        result.current.setCharAtIndex(1, "2");
      });

      expect(result.current.getFirstEmptyIndex()).toBe(2);
    });

    it("returns last index when all slots are filled", () => {
      const { result } = renderHook(() => useOptState({ length: 4, value: "1234" }));

      expect(result.current.getFirstEmptyIndex()).toBe(3);
    });

    it("returns 0 when all slots are empty", () => {
      const { result } = renderHook(() => useOptState({ length: 6 }));

      expect(result.current.getFirstEmptyIndex()).toBe(0);
    });
  });

  describe("controlled vs uncontrolled", () => {
    it("updates internal state when uncontrolled", () => {
      const { result } = renderHook(() => useOptState({ length: 6 }));

      act(() => {
        result.current.setCharAtIndex(0, "1");
      });

      expect(result.current.value[0]).toBe("1");
    });

    it("reflects controlled value changes", () => {
      const { result, rerender } = renderHook(({ value }) => useOptState({ length: 6, value }), {
        initialProps: { value: "123" },
      });

      expect(result.current.value).toEqual(["1", "2", "3", "", "", ""]);

      rerender({ value: "456789" });

      expect(result.current.value).toEqual(["4", "5", "6", "7", "8", "9"]);
    });
  });
});

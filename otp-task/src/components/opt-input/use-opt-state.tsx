import { useCallback, useRef, useState, useMemo } from "react";

type InputValidationType = "numeric" | "alpha" | "alphanumeric" | "none";

interface OptStateOptions {
  length: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  validationType?: InputValidationType;
}

const INPUT_VALIDATION_MAP: Record<
  InputValidationType,
  { regexp: RegExp; pattern: string; inputMode: "numeric" | "text" } | null
> = {
  numeric: {
    regexp: /[^\d]/g,
    pattern: "\\d{1}",
    inputMode: "numeric",
  },
  alpha: {
    regexp: /[^a-zA-Z]/g,
    pattern: "[a-zA-Z]{1}",
    inputMode: "text",
  },
  alphanumeric: {
    regexp: /[^a-zA-Z0-9]/g,
    pattern: "[a-zA-Z0-9]{1}",
    inputMode: "text",
  },
  none: null,
};

export const useOptState = ({
  length,
  value: controlledValue,
  onChange,
  onComplete,
  validationType = "numeric",
}: OptStateOptions) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [internalValue, setInternalValue] = useState<string[]>(() =>
    controlledValue ? controlledValue.split("").slice(0, length) : Array(length).fill("")
  );

  const isControlled = controlledValue !== undefined;

  const value = useMemo(() => {
    if (isControlled) {
      const chars = controlledValue.split("").slice(0, length);
      while (chars.length < length) {
        chars.push("");
      }
      return chars;
    }
    return internalValue;
  }, [isControlled, controlledValue, length, internalValue]);

  const validation = INPUT_VALIDATION_MAP[validationType];

  const sanitizeChar = useCallback(
    (char: string): string => {
      if (!validation) return char;
      return char.replace(validation.regexp, "");
    },
    [validation]
  );

  const updateValue = useCallback(
    (newValue: string[]) => {
      const joinedValue = newValue.join("");
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(joinedValue);

      if (newValue.every((char) => char !== "") && newValue.length === length) {
        onComplete?.(joinedValue);
      }
    },
    [isControlled, onChange, onComplete, length]
  );

  const focusInput = useCallback((index: number) => {
    const input = inputRefs.current[index];
    if (input) {
      requestAnimationFrame(() => {
        input.focus();
        input.select();
      });
    }
  }, []);

  const setCharAtIndex = useCallback(
    (index: number, char: string) => {
      const sanitized = sanitizeChar(char);
      if (sanitized === "" && char !== "") return;

      const newValue = [...value];
      while (newValue.length < length) {
        newValue.push("");
      }
      newValue[index] = sanitized;
      updateValue(newValue);

      if (sanitized && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [value, length, sanitizeChar, updateValue, focusInput]
  );

  const clearCharAtIndex = useCallback(
    (index: number, movePrevious: boolean = true) => {
      const newValue = [...value];
      while (newValue.length < length) {
        newValue.push("");
      }

      if (newValue[index] === "" && movePrevious && index > 0) {
        newValue[index - 1] = "";
        updateValue(newValue);
        focusInput(index - 1);
      } else {
        newValue[index] = "";
        updateValue(newValue);
        if (movePrevious && index > 0) {
          focusInput(index - 1);
        }
      }
    },
    [value, length, updateValue, focusInput]
  );

  const clearAll = useCallback(() => {
    const newValue = Array(length).fill("");
    updateValue(newValue);
    focusInput(0);
  }, [length, updateValue, focusInput]);

  const handlePaste = useCallback(
    (pastedValue: string) => {
      const sanitized = validation ? pastedValue.replace(validation.regexp, "") : pastedValue;
      const chars = sanitized.split("").slice(0, length);
      const newValue = Array(length).fill("");
      chars.forEach((char, i) => {
        newValue[i] = char;
      });
      updateValue(newValue);
      focusInput(Math.min(chars.length, length - 1));
    },
    [validation, length, updateValue, focusInput]
  );

  const getFirstEmptyIndex = useCallback(() => {
    const idx = value.findIndex((char) => char === "");
    return idx === -1 ? length - 1 : idx;
  }, [value, length]);

  return {
    inputRefs,
    value,
    validation,
    setCharAtIndex,
    clearCharAtIndex,
    clearAll,
    handlePaste,
    focusInput,
    getFirstEmptyIndex,
  };
};

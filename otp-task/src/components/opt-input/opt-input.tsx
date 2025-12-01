import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState, useId } from "react";
import { useOptState } from "./use-opt-state";

type InputValidationType = "numeric" | "alpha" | "alphanumeric" | "none";

interface OptInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  validationType?: InputValidationType;
  autoFocus?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

const shakeAnimation = {
  x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
  transition: {
    duration: 0.5,
    ease: "easeInOut" as const,
  },
};

const OptInput = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  validationType = "numeric",
  autoFocus = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: OptInputProps) => {
  const groupId = useId();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [previousChars, setPreviousChars] = useState<Record<number, string>>({});

  const {
    inputRefs,
    value: internalValue,
    validation,
    setCharAtIndex,
    clearCharAtIndex,
    handlePaste,
    focusInput,
    getFirstEmptyIndex,
  } = useOptState({
    length,
    value,
    onChange,
    onComplete,
    validationType,
  });

  const handleKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      if (error && event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        // Clear all and set the new character at index 0
        const newValue = Array(length).fill("");
        newValue[0] = event.key;
        // Use handlePaste logic to update and focus correctly
        handlePaste(event.key);
        return;
      }

      switch (event.key) {
        case "Backspace":
          event.preventDefault();
          clearCharAtIndex(index, true);
          break;
        case "Delete":
          event.preventDefault();
          clearCharAtIndex(index, false);
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (index > 0) {
            focusInput(index - 1);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (index < length - 1) {
            focusInput(index + 1);
          }
          break;
        case "Home":
          event.preventDefault();
          focusInput(0);
          break;
        case "End":
          event.preventDefault();
          focusInput(length - 1);
          break;
      }
    },
    [error, handlePaste, clearCharAtIndex, focusInput, length]
  );

  const handleChange = useCallback(
    (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      if (inputValue.length > 1) {
        handlePaste(inputValue);
        return;
      }
      setPreviousChars((prev) => ({ ...prev, [index]: internalValue[index] || "" }));
      setCharAtIndex(index, inputValue);
    },
    [handlePaste, setCharAtIndex, internalValue]
  );

  const handlePasteEvent = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      const pastedValue = event.clipboardData.getData("text");
      handlePaste(pastedValue);
    },
    [handlePaste]
  );

  const handleFocus = useCallback(
    (index: number) => {
      setFocusedIndex(index);
      const firstEmpty = getFirstEmptyIndex();
      if (index > firstEmpty) {
        focusInput(firstEmpty);
      }
    },
    [getFirstEmptyIndex, focusInput]
  );

  const handleBlur = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  const handleContainerClick = useCallback(() => {
    if (disabled) return;
    const firstEmpty = getFirstEmptyIndex();
    focusInput(firstEmpty);
  }, [disabled, getFirstEmptyIndex, focusInput]);

  const filledCount = internalValue.filter((char) => char !== "").length;

  return (
    <motion.div
      role="group"
      aria-label={ariaLabel || `Enter ${length}-digit verification code`}
      aria-describedby={ariaDescribedBy}
      className="flex gap-3"
      onPaste={handlePasteEvent}
      onClick={handleContainerClick}
      animate={error ? shakeAnimation : {}}
    >
      {Array.from({ length }).map((_, index) => {
        const char = internalValue[index] || "";
        const isFilled = char !== "";
        const isFocused = focusedIndex === index;
        const isHighlighted = error ? index === 0 : index === filledCount && filledCount < length;
        const prevChar = previousChars[index];
        const isNewChar = char !== "" && prevChar !== char;

        return (
          <div key={`${groupId}-input-${index}`} className="relative">
            <motion.input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              id={`${groupId}-input-${index}`}
              type="text"
              inputMode={validation?.inputMode || "numeric"}
              pattern={validation?.pattern}
              maxLength={1}
              value={char}
              disabled={disabled}
              aria-label={`Digit ${index + 1} of ${length}`}
              aria-invalid={error}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              autoFocus={autoFocus && index === 0}
              data-index={index}
              className={`
                w-12 h-14 text-center text-xl font-semibold
                bg-[#1d1d1f] rounded-lg
                outline-none
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                text-transparent
                caret-transparent
                selection:bg-transparent
                ${
                  error
                    ? "border-2 border-[#ff3b30]"
                    : isHighlighted || isFocused
                    ? "border-2 border-[#0071e3]"
                    : "border border-[#3d3d3f]"
                }
              `}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              initial={false}
              animate={{
                scale: isFocused ? 1.05 : 1,
              }}
              transition={{ duration: 0.15 }}
            />
            <AnimatePresence mode="popLayout">
              {isFilled && (
                <motion.span
                  key={`${groupId}-char-${index}-${char}`}
                  className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-[#f5f5f7] pointer-events-none"
                  initial={isNewChar ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {char}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
};

export default OptInput;

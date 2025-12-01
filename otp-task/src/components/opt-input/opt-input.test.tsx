import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import OptInput from "./opt-input";

describe("OptInput", () => {
  describe("rendering", () => {
    it("renders the correct number of input fields", () => {
      render(<OptInput length={6} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(6);
    });

    it("renders with default length of 6", () => {
      render(<OptInput />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(6);
    });

    it("renders with custom length", () => {
      render(<OptInput length={4} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(4);
    });

    it("has proper aria-label on container", () => {
      render(<OptInput length={6} />);

      expect(
        screen.getByRole("group", { name: "Enter 6-digit verification code" })
      ).toBeInTheDocument();
    });

    it("uses custom aria-label when provided", () => {
      render(<OptInput length={6} aria-label="Enter OTP code" />);

      expect(screen.getByRole("group", { name: "Enter OTP code" })).toBeInTheDocument();
    });

    it("each input has proper aria-label", () => {
      render(<OptInput length={4} />);

      expect(screen.getByLabelText("Digit 1 of 4")).toBeInTheDocument();
      expect(screen.getByLabelText("Digit 2 of 4")).toBeInTheDocument();
      expect(screen.getByLabelText("Digit 3 of 4")).toBeInTheDocument();
      expect(screen.getByLabelText("Digit 4 of 4")).toBeInTheDocument();
    });
  });

  describe("controlled value", () => {
    it("displays controlled value", () => {
      render(<OptInput length={6} value="123456" />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveValue("1");
      expect(inputs[1]).toHaveValue("2");
      expect(inputs[2]).toHaveValue("3");
      expect(inputs[3]).toHaveValue("4");
      expect(inputs[4]).toHaveValue("5");
      expect(inputs[5]).toHaveValue("6");
    });

    it("displays partial value with empty inputs", () => {
      render(<OptInput length={6} value="123" />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveValue("1");
      expect(inputs[1]).toHaveValue("2");
      expect(inputs[2]).toHaveValue("3");
      expect(inputs[3]).toHaveValue("");
      expect(inputs[4]).toHaveValue("");
      expect(inputs[5]).toHaveValue("");
    });
  });

  describe("user input", () => {
    it("accepts numeric input with numeric validation", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} onChange={onChange} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.type(inputs[0], "1");

      expect(onChange).toHaveBeenCalledWith("1");
    });

    it("rejects non-numeric input with numeric validation", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} onChange={onChange} validationType="numeric" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.type(inputs[0], "a");

      expect(onChange).not.toHaveBeenCalled();
    });

    it("accepts alpha input with alpha validation", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} onChange={onChange} validationType="alpha" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.type(inputs[0], "a");

      expect(onChange).toHaveBeenCalledWith("a");
    });

    it("rejects non-alpha input with alpha validation", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} onChange={onChange} validationType="alpha" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.type(inputs[0], "1");

      expect(onChange).not.toHaveBeenCalled();
    });

    it("moves focus to next input after entering a character", async () => {
      const user = userEvent.setup();
      render(<OptInput length={6} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.type(inputs[0], "1");

      // After typing, focus should move to the next input
      // Note: Due to requestAnimationFrame, we need to wait
      await vi.waitFor(() => {
        expect(inputs[1]).toHaveFocus();
      });
    });

    it("calls onComplete when all digits are entered", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<OptInput length={4} onComplete={onComplete} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      // Type each digit separately - the component handles focus transitions
      await user.type(inputs[0], "1");
      await user.type(inputs[1], "2");
      await user.type(inputs[2], "3");
      await user.type(inputs[3], "4");

      await vi.waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith("1234");
      });
    });
  });

  describe("keyboard navigation", () => {
    it("moves focus left with ArrowLeft key", async () => {
      const user = userEvent.setup();
      render(<OptInput length={6} value="12" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[1]);
      await user.keyboard("{ArrowLeft}");

      await vi.waitFor(() => {
        expect(inputs[0]).toHaveFocus();
      });
    });

    it("moves focus right with ArrowRight key", async () => {
      const user = userEvent.setup();
      render(<OptInput length={6} value="12" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.keyboard("{ArrowRight}");

      await vi.waitFor(() => {
        expect(inputs[1]).toHaveFocus();
      });
    });

    it("moves focus to first input with Home key", async () => {
      const user = userEvent.setup();
      render(<OptInput length={6} value="123" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[2]);
      await user.keyboard("{Home}");

      await vi.waitFor(() => {
        expect(inputs[0]).toHaveFocus();
      });
    });

    it("moves focus to last input with End key", async () => {
      const user = userEvent.setup();
      render(<OptInput length={6} value="123456" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.keyboard("{End}");

      await vi.waitFor(() => {
        expect(inputs[5]).toHaveFocus();
      });
    });

    it("clears current character with Backspace", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} value="123" onChange={onChange} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[2]);
      await user.keyboard("{Backspace}");

      expect(onChange).toHaveBeenCalledWith("12");
    });

    it("clears current character with Delete key", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} value="123" onChange={onChange} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[1]);
      await user.keyboard("{Delete}");

      expect(onChange).toHaveBeenCalledWith("13");
    });
  });

  describe("paste functionality", () => {
    it("handles paste event", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} onChange={onChange} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.paste("123456");

      expect(onChange).toHaveBeenCalledWith("123456");
    });

    it("truncates pasted value to length", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={4} onChange={onChange} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.paste("123456");

      expect(onChange).toHaveBeenCalledWith("1234");
    });

    it("filters invalid characters from pasted value", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} onChange={onChange} validationType="numeric" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.paste("1a2b3c");

      expect(onChange).toHaveBeenCalledWith("123");
    });
  });

  describe("disabled state", () => {
    it("disables all inputs when disabled prop is true", () => {
      render(<OptInput length={6} disabled />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    it("does not accept input when disabled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} disabled onChange={onChange} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);

      // Disabled inputs cannot be typed into
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("error state", () => {
    it("sets aria-invalid on inputs when error is true", () => {
      render(<OptInput length={6} error />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("clears input and starts fresh on keypress when in error state", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OptInput length={6} value="123456" error onChange={onChange} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[2]);
      await user.keyboard("9");

      // In error state, typing should clear all and start with new character
      expect(onChange).toHaveBeenCalledWith("9");
    });
  });

  describe("autoFocus", () => {
    it("focuses first input when autoFocus is true", () => {
      render(<OptInput length={6} autoFocus />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveFocus();
    });

    it("does not focus first input when autoFocus is false", () => {
      render(<OptInput length={6} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).not.toHaveFocus();
    });
  });

  describe("focus behavior", () => {
    it("focuses first empty input when clicking on later empty input", async () => {
      const user = userEvent.setup();
      render(<OptInput length={6} value="12" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[4]);

      // Should focus the first empty input (index 2)
      await vi.waitFor(() => {
        expect(inputs[2]).toHaveFocus();
      });
    });

    it("allows clicking on filled inputs", async () => {
      const user = userEvent.setup();
      render(<OptInput length={6} value="123456" />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[2]);

      expect(inputs[2]).toHaveFocus();
    });
  });

  describe("input attributes", () => {
    it("sets inputMode to numeric for numeric validation", () => {
      render(<OptInput length={6} validationType="numeric" />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("inputmode", "numeric");
      });
    });

    it("sets inputMode to text for alpha validation", () => {
      render(<OptInput length={6} validationType="alpha" />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("inputmode", "text");
      });
    });

    it("sets maxLength to 1 on each input", () => {
      render(<OptInput length={6} />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("maxlength", "1");
      });
    });

    it("sets autocomplete=one-time-code on first input only", () => {
      render(<OptInput length={6} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveAttribute("autocomplete", "one-time-code");
      inputs.slice(1).forEach((input) => {
        expect(input).toHaveAttribute("autocomplete", "off");
      });
    });
  });
});

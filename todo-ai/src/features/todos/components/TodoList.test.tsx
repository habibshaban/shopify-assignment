import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "./TodoList";
import { useTodoStore } from "../store";

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: {
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    button: ({
      children,
      className,
      type,
      ...props
    }: {
      children?: React.ReactNode;
      className?: string;
      type?: string;
      [key: string]: unknown;
    }) => (
      <button className={className} type={type as "submit" | "reset" | "button"} {...props}>
        {children}
      </button>
    ),
    p: ({
      children,
      className,
      ...props
    }: {
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => (
      <p className={className} {...props}>
        {children}
      </p>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("TodoList Component", () => {
  beforeEach(() => {
    // Reset store state before each test
    useTodoStore.setState({ todos: [] });
  });

  it("should render empty state message when no todos", () => {
    render(<TodoList />);

    expect(
      screen.getByText(/No todos yet. Add one above or ask the AI to help you plan!/i)
    ).toBeInTheDocument();
  });

  it("should render the add todo form", () => {
    render(<TodoList />);

    expect(screen.getByPlaceholderText(/Add a new todo.../i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("should add a new todo when submitting the form", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/Add a new todo.../i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(input, "New test todo");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("New test todo")).toBeInTheDocument();
    });

    // Input should be cleared after adding
    expect(input).toHaveValue("");
  });

  it("should add todo when pressing Enter", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/Add a new todo.../i);

    await user.type(input, "Todo via Enter{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Todo via Enter")).toBeInTheDocument();
    });
  });

  it("should not add empty todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/Add a new todo.../i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(input, "   ");
    await user.click(addButton);

    expect(
      screen.getByText(/No todos yet. Add one above or ask the AI to help you plan!/i)
    ).toBeInTheDocument();
  });

  it("should display multiple todos", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/Add a new todo.../i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(input, "First todo");
    await user.click(addButton);

    await user.type(input, "Second todo");
    await user.click(addButton);

    await user.type(input, "Third todo");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("First todo")).toBeInTheDocument();
      expect(screen.getByText("Second todo")).toBeInTheDocument();
      expect(screen.getByText("Third todo")).toBeInTheDocument();
    });
  });

  it("should remove todo when clicking delete button", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/Add a new todo.../i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(input, "Todo to remove");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Todo to remove")).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: /delete "todo to remove"/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Todo to remove")).not.toBeInTheDocument();
    });
  });

  it("should toggle todo completion", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/Add a new todo.../i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(input, "Toggle me");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Toggle me")).toBeInTheDocument();
    });

    const checkbox = screen.getByRole("checkbox", { name: /mark "toggle me" as complete/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });
});

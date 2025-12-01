import { describe, it, expect, beforeEach } from "vitest";
import { useTodoStore } from "./store";
import type { Todo } from "./types";

describe("Todo Store", () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [] });
  });

  describe("addTodo", () => {
    it("should add a new todo to the list", () => {
      const { addTodo } = useTodoStore.getState();

      addTodo("Test todo");

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe("Test todo");
      expect(todos[0].completed).toBe(false);
      expect(todos[0].id).toBeDefined();
      expect(todos[0].createdAt).toBeDefined();
    });

    it("should add multiple todos", () => {
      const { addTodo } = useTodoStore.getState();

      addTodo("First todo");
      addTodo("Second todo");
      addTodo("Third todo");

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(3);
      expect(todos.map((t) => t.text)).toEqual(["First todo", "Second todo", "Third todo"]);
    });

    it("should generate unique IDs for each todo", () => {
      const { addTodo } = useTodoStore.getState();

      addTodo("Todo 1");
      addTodo("Todo 2");

      const { todos } = useTodoStore.getState();
      expect(todos[0].id).not.toBe(todos[1].id);
    });
  });

  describe("removeTodo", () => {
    it("should remove a todo by ID", () => {
      const { addTodo, removeTodo } = useTodoStore.getState();

      addTodo("Todo to remove");
      const { todos: todosAfterAdd } = useTodoStore.getState();
      const todoId = todosAfterAdd[0].id;

      removeTodo(todoId);

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(0);
    });

    it("should only remove the specified todo", () => {
      const { addTodo, removeTodo } = useTodoStore.getState();

      addTodo("Keep this");
      addTodo("Remove this");
      addTodo("Keep this too");

      const { todos: todosAfterAdd } = useTodoStore.getState();
      const todoToRemove = todosAfterAdd.find((t) => t.text === "Remove this");

      removeTodo(todoToRemove!.id);

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(2);
      expect(todos.map((t) => t.text)).toEqual(["Keep this", "Keep this too"]);
    });

    it("should do nothing when removing non-existent ID", () => {
      const { addTodo, removeTodo } = useTodoStore.getState();

      addTodo("Test todo");
      removeTodo("non-existent-id");

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(1);
    });
  });

  describe("toggleTodo", () => {
    it("should toggle todo completion status", () => {
      const { addTodo, toggleTodo } = useTodoStore.getState();

      addTodo("Test todo");
      const { todos: todosAfterAdd } = useTodoStore.getState();
      const todoId = todosAfterAdd[0].id;

      expect(todosAfterAdd[0].completed).toBe(false);

      toggleTodo(todoId);
      const { todos: todosAfterFirstToggle } = useTodoStore.getState();
      expect(todosAfterFirstToggle[0].completed).toBe(true);

      toggleTodo(todoId);
      const { todos: todosAfterSecondToggle } = useTodoStore.getState();
      expect(todosAfterSecondToggle[0].completed).toBe(false);
    });
  });

  describe("editTodo", () => {
    it("should update todo text", () => {
      const { addTodo, editTodo } = useTodoStore.getState();

      addTodo("Original text");
      const { todos: todosAfterAdd } = useTodoStore.getState();
      const todoId = todosAfterAdd[0].id;

      editTodo(todoId, "Updated text");

      const { todos } = useTodoStore.getState();
      expect(todos[0].text).toBe("Updated text");
    });

    it("should preserve other todo properties when editing", () => {
      const { addTodo, toggleTodo, editTodo } = useTodoStore.getState();

      addTodo("Test todo");
      const { todos: todosAfterAdd } = useTodoStore.getState();
      const todoId = todosAfterAdd[0].id;
      const createdAt = todosAfterAdd[0].createdAt;

      toggleTodo(todoId);
      editTodo(todoId, "Updated text");

      const { todos } = useTodoStore.getState();
      expect(todos[0].completed).toBe(true);
      expect(todos[0].createdAt).toBe(createdAt);
      expect(todos[0].id).toBe(todoId);
    });
  });

  describe("setTodos", () => {
    it("should replace all todos", () => {
      const { addTodo, setTodos } = useTodoStore.getState();

      addTodo("Old todo");

      const newTodos: Todo[] = [
        { id: "1", text: "New todo 1", completed: false, createdAt: Date.now() },
        { id: "2", text: "New todo 2", completed: true, createdAt: Date.now() },
      ];

      setTodos(newTodos);

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(2);
      expect(todos).toEqual(newTodos);
    });
  });
});

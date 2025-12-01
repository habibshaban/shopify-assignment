import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Todo } from "./types";

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  toggleTodo: (id: string) => void;
  setTodos: (todos: Todo[]) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              text,
              completed: false,
              createdAt: Date.now(),
            },
          ],
        })),
      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      setTodos: (todos) => set({ todos }),
    }),
    {
      name: "todo-storage",
    }
  )
);

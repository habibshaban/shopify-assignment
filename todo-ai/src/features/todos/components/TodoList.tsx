import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTodoStore } from "../store";
import { TodoItem } from "./TodoItem";

export function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const { todos, addTodo, removeTodo, editTodo, toggleTodo } = useTodoStore();

  const sortedTodos = useMemo(() => [...todos].sort((a, b) => b.createdAt - a.createdAt), [todos]);

  const handleAddTodo = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newTodo.trim()) {
        addTodo(newTodo.trim());
        setNewTodo("");
      }
    },
    [newTodo, addTodo]
  );

  const handleToggle = useCallback((id: string) => toggleTodo(id), [toggleTodo]);
  const handleEdit = useCallback((id: string, text: string) => editTodo(id, text), [editTodo]);
  const handleRemove = useCallback((id: string) => removeTodo(id), [removeTodo]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 bg-gray-800 text-gray-100 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add
          </motion.button>
        </div>
      </form>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
          ))}
        </AnimatePresence>
      </div>

      {todos.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-8"
        >
          No todos yet. Add one above or ask the AI to help you plan!
        </motion.p>
      )}
    </div>
  );
}

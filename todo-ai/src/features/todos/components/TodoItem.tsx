import { useState, useCallback, memo } from "react";
import { motion } from "motion/react";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}

export const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onEdit,
  onRemove,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSubmit = useCallback(() => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  }, [editText, onEdit, todo.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape") {
        setEditText(todo.text);
        setIsEditing(false);
      }
    },
    [handleSubmit, todo.text]
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg group"
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900"
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-gray-700 text-gray-100 px-3 py-1 rounded outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <span
          className={`flex-1 ${todo.completed ? "line-through text-gray-500" : "text-gray-100"}`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => onRemove(todo.id)}
          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
});

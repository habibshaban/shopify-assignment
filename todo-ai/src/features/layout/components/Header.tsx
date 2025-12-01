import { memo } from "react";

export const Header = memo(function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      <h1 className="text-2xl font-bold text-white">Todo AI</h1>
    </header>
  );
});

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={viteLogo} className="h-24 p-4" alt="Vite logo" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          className="transition-transform hover:scale-110"
        >
          <img
            src={reactLogo}
            className="h-24 p-4 animate-spin"
            style={{ animationDuration: "20s" }}
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-5xl font-bold mb-8 text-white">Vite + React</h1>
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer"
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-400">
          Edit <code className="bg-gray-700 px-2 py-1 rounded text-sm">src/App.tsx</code> and save
          to test HMR
        </p>
      </div>
      <p className="mt-8 text-gray-500">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;

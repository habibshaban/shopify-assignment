import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { TodoList } from "./features/todos";
import { Header } from "./features/layout";
import { useTodoActions } from "./features/ai";

function App() {
  useTodoActions();

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="p-8">
        <TodoList />
      </main>
      <CopilotPopup
        labels={{
          title: "Trip Planner AI",
          initial:
            "Hi! I can help you plan your trip and manage your todo list. Try asking me to help plan a trip to Paris!",
        }}
        instructions="You are a helpful trip planning assistant. You help users create and manage todo lists for their trips. You can check real-time weather for destinations and provide advice. Always use the getWeather action to check weather before making outdoor activity recommendations. When creating trip todos, be specific and practical."
      />
    </div>
  );
}

export default App;

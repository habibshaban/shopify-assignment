import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useTodoStore } from "../../todos";

export function useTodoActions() {
  const { todos, addTodo, removeTodo, editTodo, toggleTodo } = useTodoStore();

  useCopilotReadable({
    description: "The current list of todos",
    value: todos,
  });

  useCopilotAction({
    name: "addTodo",
    description: "Add a new todo item to the list",
    parameters: [
      {
        name: "text",
        type: "string",
        description: "The text content of the todo",
        required: true,
      },
    ],
    handler: ({ text }) => {
      addTodo(text);
      return `Added todo: "${text}"`;
    },
  });

  useCopilotAction({
    name: "addMultipleTodos",
    description: "Add multiple todo items at once",
    parameters: [
      {
        name: "todos",
        type: "string[]",
        description: "Array of todo texts to add",
        required: true,
      },
    ],
    handler: ({ todos: todoTexts }) => {
      todoTexts.forEach((text: string) => addTodo(text));
      return `Added ${todoTexts.length} todos`;
    },
  });

  useCopilotAction({
    name: "removeTodo",
    description: "Remove a todo item by its ID",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The ID of the todo to remove",
        required: true,
      },
    ],
    handler: ({ id }) => {
      removeTodo(id);
      return `Removed todo with ID: ${id}`;
    },
  });

  useCopilotAction({
    name: "editTodo",
    description: "Edit the text of an existing todo",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The ID of the todo to edit",
        required: true,
      },
      {
        name: "text",
        type: "string",
        description: "The new text for the todo",
        required: true,
      },
    ],
    handler: ({ id, text }) => {
      editTodo(id, text);
      return `Updated todo: "${text}"`;
    },
  });

  useCopilotAction({
    name: "toggleTodo",
    description: "Toggle the completed status of a todo",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The ID of the todo to toggle",
        required: true,
      },
    ],
    handler: ({ id }) => {
      toggleTodo(id);
      return `Toggled todo completion status`;
    },
  });

  useCopilotAction({
    name: "getWeather",
    description: "Get current weather for a location to help plan activities",
    parameters: [
      {
        name: "location",
        type: "string",
        description: "The city or location to get weather for",
        required: true,
      },
    ],
    handler: async ({ location }) => {
      try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
        const data = await response.json();
        const current = data.current_condition[0];
        return {
          location,
          temperature: `${current.temp_C}°C / ${current.temp_F}°F`,
          condition: current.weatherDesc[0].value,
          humidity: `${current.humidity}%`,
          windSpeed: `${current.windspeedKmph} km/h`,
        };
      } catch {
        return { error: "Could not fetch weather data" };
      }
    },
  });
}

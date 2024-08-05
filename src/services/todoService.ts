// this removes duplication from our other hooks
// Heirarchy is like this:
// APIClient <API Client> --> todoService <HTTP Service> --> useTodos, useAddTodos <Custom Hooks> --> TodoForm, TodoList <Components>

import APIClient from "./apiClient";

export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

export default new APIClient<Todo>("/todos");

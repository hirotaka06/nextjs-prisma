import React from "react";
import TodotableClient from "./TodotableClient";
import { Todo } from "@/app/types";

async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch("http://localhost:3000/api/todos", {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  return response.json();
}

export default async function TodoTableServer() {
  const todos = await fetchTodos();

  return <TodotableClient initialTodos={todos} />;
}

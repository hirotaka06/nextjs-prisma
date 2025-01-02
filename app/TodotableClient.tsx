"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CirclePlus, X, Badge, BadgeCheck } from "lucide-react";
import { Todo } from "@/app/types";
import TodoForm from "./TodoForm";

interface TodotableClientProps {
  initialTodos: Todo[];
}

export default function TodotableClient({
  initialTodos,
}: TodotableClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [todos, setTodos] = useState<Todo[]>(
    initialTodos.sort((a, b) => a.id - b.id)
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  const addTodo = (newTodo: Todo) => {
    setTodos((prevTodos) =>
      [...prevTodos, newTodo].sort((a, b) => a.id - b.id)
    );
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        const deletedTodo = todos.find((todo) => todo.id === id);
        const slackResponse = await fetch("/api/slack", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `ToDoが削除されました: ${deletedTodo?.title}`,
          }),
        });

        if (!slackResponse.ok) {
          console.error("Failed to send Slack message");
        }
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTodo = async (id: number, title: string, done: boolean) => {
    try {
      const response = await fetch(`/api/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, done }),
      });
      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos((prevTodos) =>
          prevTodos
            .map((todo) =>
              todo.id === id
                ? { ...todo, title: updatedTodo.title, done: updatedTodo.done }
                : todo
            )
            .sort((a, b) => a.id - b.id)
        );
        setEditingId(null);
        const originalTodo = todos.find((todo) => todo.id === id);
        if (originalTodo?.title !== updatedTodo.title) {
          const slackResponse = await fetch("/api/slack", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `ToDoのタイトルが変更されました: '${originalTodo?.title}' から '${updatedTodo.title}' に変更されました`,
            }),
          });

          if (!slackResponse.ok) {
            console.error("Failed to send Slack message");
          }
        }

        if (updatedTodo.done) {
          const slackResponse = await fetch("/api/slack", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `ToDoが完了しました: '${updatedTodo.title}'`,
            }),
          });

          if (!slackResponse.ok) {
            console.error("Failed to send Slack message");
          }
        }
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="rounded-md overflow-hidden bg-card border w-1/2 mx-auto">
      <div className="mx-auto p-8 space-y-8">
        <Header toggleForm={toggleFormVisibility} showForm={showForm} />
        {showForm && (
          <TodoForm closeForm={() => setShowForm(false)} addTodo={addTodo} />
        )}
        <TodoTable
          todos={todos}
          deleteTodo={deleteTodo}
          editingId={editingId}
          setEditingId={setEditingId}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          updateTodo={updateTodo}
        />
      </div>
    </div>
  );
}

function Header({
  toggleForm,
  showForm,
}: {
  toggleForm: () => void;
  showForm: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight font-mono">Todo List</h1>
      <Button className="bg-green-600 hover:bg-green-700" onClick={toggleForm}>
        {showForm ? (
          <X className="h-4 w-4 font-mono" />
        ) : (
          <CirclePlus className="mr-2 h-4 w-4 font-mono" />
        )}
        {showForm ? "Cancel" : "Add Todo"}
      </Button>
    </div>
  );
}

function TodoTable({
  todos,
  deleteTodo,
  editingId,
  setEditingId,
  newTitle,
  setNewTitle,
  updateTodo,
}: {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  newTitle: string;
  setNewTitle: (title: string) => void;
  updateTodo: (id: number, title: string, done: boolean) => void;
}) {
  return (
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="text-gray-500 font-mono font-bold">
            TITLE
          </TableHead>
          <TableHead className="text-gray-500 w-20 font-mono font-bold">
            DATE
          </TableHead>
          <TableHead className="text-gray-500 w-20 font-mono font-bold">
            DONE
          </TableHead>
          <TableHead className="text-gray-500 w-20 font-mono font-bold">
            EDIT
          </TableHead>
          <TableHead className="text-gray-500 w-20 font-mono font-bold">
            DELETE
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo) => (
          <TableRow key={todo.id}>
            <TableCell>
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="border border-black p-2 rounded-md"
                />
              ) : (
                todo.title
              )}
            </TableCell>
            <TableCell>{new Date(todo.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateTodo(todo.id, todo.title, !todo.done)}
              >
                {todo.done ? (
                  <BadgeCheck className="h-6 w-6 text-green-500" />
                ) : (
                  <Badge className="h-6 w-6 text-gray-500" />
                )}
              </Button>
            </TableCell>
            <TableCell>
              {editingId === todo.id ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => updateTodo(todo.id, newTitle, todo.done)}
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-500 transition-colors focus:outline-none"
                  onClick={() => {
                    setEditingId(todo.id);
                    setNewTitle(todo.title);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0  text-muted-foreground hover:text-red-500 transition-colors focus:outline-none"
                onClick={() => deleteTodo(todo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

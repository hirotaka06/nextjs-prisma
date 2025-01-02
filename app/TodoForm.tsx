"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Todo } from "./types";

interface TodoFormProps {
  closeForm: () => void;
  addTodo: (newTodo: Todo) => void;
}

export default function TodoForm({ closeForm, addTodo }: TodoFormProps) {
  const [newTodo, setNewTodo] = useState<{ title: string }>({
    title: "",
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTodo({
      ...newTodo,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodo.title,
          done: false,
        }),
      });

      if (response.ok) {
        const createdTodo = await response.json();
        addTodo(createdTodo);
        closeForm();
        router.refresh();
        await sendSlackNotification(`New Todo added: ${newTodo.title}`);
      } else {
        console.error("Failed to create new Todo");
      }
    } catch (error) {
      console.error("Error creating new Todo:", error);
    }
  };

  const sendSlackNotification = async (message: string) => {
    try {
      const response = await fetch("/api/slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error(`Slack notification error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending Slack notification:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newTodo.title}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        Submit
      </Button>
    </form>
  );
}

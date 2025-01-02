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
      console.log("Sending request to /api/todos");
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

      console.log("Received response from /api/todos", response);

      if (response.ok) {
        const createdTodo = await response.json();
        addTodo(createdTodo);
        closeForm();
        router.refresh();
        console.log("Sending request to /api/slack");
        const slackResponse = await fetch("/api/slack", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
          },
          body: JSON.stringify({
            text: `新しいToDoが追加されました: ${newTodo.title}`,
          }),
        });

        console.log("Received response from /api/slack", slackResponse);

        if (!slackResponse.ok) {
          console.error("Failed to send Slack message", slackResponse.status);
        }
      } else {
        console.error("Failed to create new Todo", response.status);
      }
    } catch (error) {
      console.error("Error creating new Todo:", error);
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

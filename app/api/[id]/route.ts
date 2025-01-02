import { NextResponse } from "next/server";
import prisma from "@/lib/PrismaClient";

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;

  try {
    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;

  try {
    const { title, done } = await request.json();
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { title, done },
    });
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

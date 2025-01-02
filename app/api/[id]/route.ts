import { NextResponse } from "next/server";
import prisma from "@/lib/PrismaClient";

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const { title, done } = await request.json();

  try {
    const updated = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { title, done },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

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

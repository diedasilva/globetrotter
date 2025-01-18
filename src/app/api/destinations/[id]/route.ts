import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Check if destination exists
    const existingDestination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!existingDestination) {
      return NextResponse.json(
        { message: "Destination not found" },
        { status: 404 }
      );
    }

    // Update destination
    const updatedDestination = await prisma.destination.update({
      where: { id },
      data: {
        title: body.title,
        city: body.city,
        country: body.country,
        latitude: body.latitude,
        longitude: body.longitude,
        review: body.review,
        globalScore: body.globalScore,
        description: body.description,
      },
    });

    return NextResponse.json(updatedDestination);
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json(
      { message: "Error updating destination" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {

    // Check if destination exists
    const existingDestination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!existingDestination) {
      return NextResponse.json(
        { message: "Destination not found" },
        { status: 404 }
      );
    }

    // Delete destination
    await prisma.destination.delete({ where: { id } });

    return NextResponse.json({ message: "Destination deleted" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { message: "Error deleting destination" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  // Récupérer la session utilisateur
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Récupérer toutes les destinations de l'utilisateur
    const destinations = await prisma.destination.findMany({
      where: { userId: session.user.id }, 
      select: {
        id: true,
        latitude: true,
        longitude: true,
        city: true,
        country: true,
        title: true,
        review: true,
        globalScore: true,
        description: true,
        createdAt: true,
      },
    });

    return NextResponse.json(destinations, { status: 200 });
  } catch (error) {
    console.error("Error fetching user destinations:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

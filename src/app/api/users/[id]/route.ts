import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/utils/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from 'bcrypt';
// Récupération d'un utilisateur
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params; // Attendez `params`

  // Vérifiez l'authentification de l'utilisateur
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Récupérez l'utilisateur avec Prisma
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Mise à jour d'un utilisateur
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params; // Attendez `params`
  const session = await getServerSession(authOptions);

  // Vérifiez l'authentification et les autorisations
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, newPassword } = body; // Les champs à mettre à jour

    // Vérifiez si l'utilisateur authentifié correspond à l'utilisateur à mettre à jour
    if (session.user.id !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if(newPassword) {
      // Mettre à jour le mot de passe avec bcrypt
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { name, email, password: hashedPassword },
      });
      return NextResponse.json(updatedUser, { status: 200 });
    }

    // Mettre à jour l'utilisateur avec Prisma
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email},
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Suppression d'un utilisateur
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = await context.params; // Attendez `params`
  const session = await getServerSession(authOptions);

  // Vérifiez l'authentification et les autorisations
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Vérifiez si l'utilisateur authentifié correspond à l'utilisateur à supprimer
    if (session.user.id !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Supprimer l'utilisateur avec Prisma
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

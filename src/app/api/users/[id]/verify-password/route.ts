// Verifier le mot de passe
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import {prisma} from "@/utils/prisma"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      const { password } = body;
  
      if (session.user.id !== id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
  
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      // Compare passwords using bcrypt
      const isValid = await bcrypt.compare(password, user.password);
      return NextResponse.json({ success: isValid }, { status: 200 });
    } catch (error) {
      console.error("Error verifying password:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }
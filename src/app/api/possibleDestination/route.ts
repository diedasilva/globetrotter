

import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// Get all destinations from the database at table PossibleDestinations
export async function GET() {
    const destinations = await prisma.possibleDestination.findMany();
    return NextResponse.json(destinations, { status: 200 });
  }
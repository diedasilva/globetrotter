//export async function GET(req: NextRequest, context: { params: { id: string } }) {

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Path: src/app/api/destinations
// Get all destinations from the database at table PossibleDestinations
export async function GET() {
  const destinations = await prisma.possibleDestination.findMany();
  return NextResponse.json(destinations, { status: 200 });
}

//POST request to add a new destination to the database
//Destination table
export async function POST(req: NextRequest) {
  // Vérifiez la session utilisateur
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      latitude,
      longitude,
      city,
      country,
      title,
      review,
      globalScore,
      description,
    } = body;

    // Validation des données requises
    if (!latitude || !longitude || !city || !country) {
      return NextResponse.json(
        { message: "Latitude, longitude, city, and country are required." },
        { status: 400 }
      );
    }

    // Conversion des valeurs en nombres
    const latitudeFloat = parseFloat(latitude);
    const longitudeFloat = parseFloat(longitude);
    const globalScoreFloat = globalScore ? parseFloat(globalScore) : null;

    // Vérification de la validité des données après conversion
    if (isNaN(latitudeFloat) || isNaN(longitudeFloat)) {
      return NextResponse.json(
        { message: "Latitude and longitude must be valid numbers." },
        { status: 400 }
      );
    }

    if (
      globalScoreFloat !== null &&
      (globalScoreFloat < 0 || globalScoreFloat > 5)
    ) {
      return NextResponse.json(
        { message: "Global score must be between 0 and 5." },
        { status: 400 }
      );
    }

    // Création de la destination
    const newdestination = await prisma.destination.create({
      data: {
        userId: session.user.id, // Utilisateur authentifié
        latitude: latitudeFloat,
        longitude: longitudeFloat,
        city,
        country,
        title: title || null,
        review: review || null,
        globalScore: globalScoreFloat,
        description: description || null,
      },
    });

    return NextResponse.json(newdestination, { status: 201 });
  } catch (error) {
    console.log("Error creating destination:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

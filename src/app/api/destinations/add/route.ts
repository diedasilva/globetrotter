import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, name, latitude, longitude, review, globalScore, description } =
    req.body;

  if (!userId || !name || !latitude || !longitude || !globalScore) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const destination = await prisma.destination.create({
      data: {
        userId,
        name,
        latitude,
        longitude,
        review,
        globalScore,
        description,
      },
    });
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: "Failed to add destination :"+error });
  }
}

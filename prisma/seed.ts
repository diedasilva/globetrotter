import { prisma } from "../src/utils/prisma";

async function seed() {
  const destinations = [
    {
      city: "Paris",
      country: "France",
      latitude: 48.8566,
      longitude: 2.3522,
    },
    {
      city: "New York",
      country: "United States",
      latitude: 40.7128,
      longitude: -74.006,
    },
    {
      city: "Tokyo",
      country: "Japan",
      latitude: 35.6895,
      longitude: 139.6917,
    },
    {
      city: "Rio de Janeiro",
      country: "Brazil",
      latitude: -22.9068,
      longitude: -43.1729,
    },
    {
      city: "Sydney",
      country: "Australia",
      latitude: -33.8688,
      longitude: 151.2093,
    },
    {
        city: "Cape Town",
        country: "South Africa",
        latitude: -33.9249,
        longitude: 18.4241,
    },
    {
        city: "Reykjavik",
        country: "Iceland",
        latitude: 64.1466,
        longitude: -21.9426,
    },
    {
        city: "Machu Picchu",
        country: "Peru",
        latitude: -13.1631,
        longitude: -72.545,
    },
    {
        city: "Santorini",
        country: "Greece",
        latitude: 36.3932,
        longitude: 25.4615,
    },
    {
        city: "Kyoto",
        country: "Japan",
        latitude: 35.0116,
        longitude: 135.7681,
    },
    {
        city: "Banff",
        country: "Canada",
        latitude: 51.1784,
        longitude: -115.5708,
    },
    {
        city: "Bora Bora",
        country: "French Polynesia",
        latitude: -16.5004,
        longitude: -151.7415,
    },
    {
        city: "Dubrovnik",
        country: "Croatia",
        latitude: 42.6507,
        longitude: 18.0944,
    },
    {
        city: "Marrakech",
        country: "Morocco",
        latitude: 31.6295,
        longitude: -7.9811,
    },
    {
        city: "Budapest",
        country: "Hungary",
        latitude: 47.4979,
        longitude: 19.0402,
    },
    {
        city: "Bali",
        country: "Indonesia",
        latitude: -8.3405,
        longitude: 115.0920,
    },
    {
        city: "Amsterdam",
        country: "Netherlands",
        latitude: 52.3676,
        longitude: 4.9041,
    },
    {
        city: "Cusco",
        country: "Peru",
        latitude: -13.5319,
        longitude: -71.9675,
    },
    {
        city: "Barcelona",
        country: "Spain",
        latitude: 41.3851,
        longitude: 2.1734,
    },
    {
        city: "Venice",
        country: "Italy",
        latitude: 45.4408,
        longitude: 12.3155,
    },
  ];

  try {
    console.log("Seeding PossibleDestination data...");

    for (const destination of destinations) {
      await prisma.possibleDestination.create({
        data: destination,
      });
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding PossibleDestination data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

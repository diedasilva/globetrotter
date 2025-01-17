import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Ajouter les en-têtes CORS
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  // Gérer les requêtes OPTIONS (pré-vol)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*", // Appliquer le middleware uniquement aux routes API
};

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirige vers la page d'accueil après 5 secondes
    }, 5000);

    return () => clearTimeout(timer); // Nettoie le timer si le composant est démonté
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <p className="text-lg">
        You will be redirected to the home page in 5 seconds...
      </p>
    </main>
  );
}

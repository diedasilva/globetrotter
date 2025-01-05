"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import GlobeComponent from "@/components/Globe";

export default function GlobePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading... Please wait.</p>;
  }

  if (!session) {
    return <p>Access denied. Please log in to view this page.</p>;
  }
  return (
    <main className="bg-ivory min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-serif text-mocha text-center mb-8">
          Explore the Globe
        </h1>
        <div className="mb-6 text-center">
          <Link href="/" className="text-charcoal underline hover:text-sand">
            Back to Home
          </Link>
        </div>
        <div className="max-w-4xl mx-auto">
          <GlobeComponent />
        </div>
      </div>
    </main>
  );
}

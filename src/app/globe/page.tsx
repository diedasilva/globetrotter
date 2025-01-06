"use client";

import { useSession } from "next-auth/react";
import GlobeComponent from "@/components/Globe/Globe";

export default function GlobePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading... Please wait.</p>;
  }

  if (!session) {
    return <p>Access denied. Please log in to view this page.</p>;
  }
  return (
          <GlobeComponent />
  );
}

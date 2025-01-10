"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GlobeComponent from "@/components/Globe/Globe";
import Link from "next/link";

export default function GlobePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);
    console.log(status);
  }, [session, router, status]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Access Denied</h1>
        <p>You need to be authenticated to access this page.</p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Go to Home
        </Link>
      </div>
    );
  }
  return (
    <div style={{ textAlign: "center"}}>
      {/* Bouton pour se déconnecter */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sign Out
      </button>

      {/* Composant principal */}
      <GlobeComponent />
    </div>
  );
}

"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import GlobeComponent from "@/components/Globe/Globe";
import CollapsibleNav from "@/components/CollapsibleNav/CollapsibleNav";
import Link from "next/link";
import Button from "@/components/Commons/Button";

// On importe notre hook
import { useUser } from "@/hooks/useUser";

export default function GlobePage() {
  const { data: session, status } = useSession();

  // Récupère l’ID de l’utilisateur connecté
  const userId = session?.user?.id;

  // Récupère l’utilisateur avec SWR
  const { user, error, isLoading, mutateUser } = useUser(userId);

  useEffect(() => {
    console.log(session);
  }, [session, status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-600">
          You need to be authenticated to access this page.
        </p>
        <Button className="m-4">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  // On récupère le name depuis user, et on fallback à "Guest" si rien
  const userName = user?.name || "Guest";

  const menuItems = [
    { label: "Voyages" },
    { label: "Compte" },
    { label: "Aide" },
    {
      label: "Déconnexion",
      onClick: () => signOut({ callbackUrl: "/" }),
    },
  ];

  return (
    <div>
      {/* Navigation */}
      <CollapsibleNav userName={userName} menuItems={menuItems} />

      {/* Main Content */}
      <div>
        <GlobeComponent />
      </div>
    </div>
  );
}

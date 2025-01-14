"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import GlobeComponent from "@/components/Globe/Globe";
import CollapsibleNav from "@/components/CollapsibleNav/CollapsibleNav";
import Link from "next/link";
import Button from "@/components/Commons/Button";

export default function GlobePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-600">
          You need to be authenticated to access this page.
        </p>
        <Button className="m-4">
          <Link
            href="/"
          >
            Go to Home
          </Link>
        </Button>
      </div>
    );
  }

  const userName = session?.user?.name || "Guest";
  //const userImage = session?.user?.image;
  const menuItems = [
    { label: "Messages", href: "/messages" },
    { label: "Voyages", href: "/voyages" },
    { label: "Favoris", href: "/favoris" },
    { label: "Compte", href: "/account" },
    {
      label: "Déconnexion",
      href: "/",
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

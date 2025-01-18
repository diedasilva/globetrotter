"use client";

import Account from "./Content/Account";
import Help from "./Content/Help";
import Journey from "./Content/Journeys/Journeys";

interface DynamicModalContentProps {
  label: string; // Le label qui détermine le contenu
}

const DynamicModalContent: React.FC<DynamicModalContentProps> = ({ label }) => {
  
  // Retourne un contenu différent en fonction du label
  switch (label) {
    case "Voyages":
      return <Journey />;

    case "Compte":
      return <Account />;

    case "Aide":
      return <Help/>

    default:
      return <div>Default content for {label}</div>;
  }
};

export default DynamicModalContent;

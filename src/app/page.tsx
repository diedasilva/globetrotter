"use client";
import Button from "@/components/Commons/Button";
import Modal from "@/components/Commons/Modal";
import AuthForm from "@/components/Auth/AuthForm";
import { useEffect, useState } from "react";
import MapComponent from "@/components/MapComponent/MapComponent";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    // Exemple : récupérer les coordonnées via une API
    fetch("http://ip-api.com/json/")
      .then((res) => res.json())
      .then((data) => {
        setCoords({ latitude: data.lat, longitude: data.lon });
      })
      .catch((err) => console.error("Erreur de géolocalisation :", err));
  }, []);
  //console.log("Coordonnées récupérées :", coords);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="rounded-soft bg-ivory bg-opacity-40 p-4 z-10">
        <h1 className="text-4xl text-mocha mb-4">GlobeTrotter</h1>
        <p className="text-charcoal text-lg my-2 font-mono">
          Discover the world and track your travels effortlessly.
        </p>
        <p className="text-charcoal text-lg my-2 font-mono">
          Your next adventure is just a click away.
        </p>
        <div className="space-x-4 my-2">
          <Button variant="primary" onClick={openModal}>
            Get Started !
          </Button>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <AuthForm />
        </Modal>
      </div>
      <MapComponent longitude={coords.longitude} />
    </main>
  );
}

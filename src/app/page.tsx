"use client";
import Button from "@/components/Commons/Button";
import Modal from "@/components/Commons/Modal";
import AuthForm from "@/components/Auth/AuthForm";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MapComponent from "@/components/MapComponent/MapComponent";
import gsap from "gsap";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rangeRef = useRef(null);

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

  const [mapLongitude, setMapLongitude] = useState(coords.longitude);

  const [showRange, setShowRange] = useState(false);

  const handleClickSettingsButton = () => {
    setShowRange(!showRange);
  };

  useEffect(() => {
    if (showRange) {
      gsap.fromTo(
        rangeRef.current,
        {
          opacity: 0,
          y: -20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.05,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(rangeRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.05,
        ease: "power2.in",
      });
    }
  }, [showRange]);
  //console.log("Coordonnées récupérées :", coords);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      
      <div className="absolute flex flex-col gap-2 z-10 top-[1vw] right-[1vw] flex-wrap-reverse">
        <Button
          variant="tertiary"
          basic={false}
          className="p-2 max-w-[2vw]"
          onClick={() => handleClickSettingsButton()}
        >
          <Image src="/settings.svg" alt="settings" width={20} height={20} />
        </Button>
        <div ref={rangeRef} style={{ opacity: 0 }}>
          {showRange && (
            <div className="rounded-soft bg-ivory bg-opacity-40 p-2 z-10">
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={mapLongitude}
                onChange={(e) => setMapLongitude(parseFloat(e.target.value))}
                className="w-full cursor-pointer text-mocha"
              />
            </div>
          )}
        </div>
      </div>
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
      <MapComponent longitude={mapLongitude} />
    </main>
  );
}

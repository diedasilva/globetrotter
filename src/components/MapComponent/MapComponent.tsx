"use client";

import React, { useEffect, useState } from "react";
import MapEffects from "./MapEffects";

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface SuperPlanisphereProps {
  longitude: number; 
}

const SuperPlanisphere: React.FC<SuperPlanisphereProps> = ({ longitude }) => {
  const [translateX, setTranslateX] = useState(-100); 
  const [journeys, setJourneys] = useState<
    { coordsA: Location; coordsB: Location }[]
  >([]);

  const generateRandomPoint = (): Location => {
    const latitudeY = (Math.random() * 140 - 70).toFixed(6); 
    const longitudeX = ((Math.random() * 320 - 160 + longitude).toFixed(6)) ; 
    console.log(`Point(x:${longitudeX},y:${latitudeY})`);
    return {
      name: `Point(${latitudeY},${longitudeX})`,
      latitude: parseFloat(latitudeY),
      longitude: parseFloat(longitudeX),
    };
  };

  const startNewJourney = () => {
    // Dernier point de départ
    const lastJourney = journeys[journeys.length - 1];
    const coordsA = lastJourney ? lastJourney.coordsB : generateRandomPoint();
    const coordsB = generateRandomPoint();

    setJourneys((prevJourneys) => [...prevJourneys, { coordsA, coordsB }]);
  };

  useEffect(() => {
    // Centre la carte en fonction de la longitude
    const newTranslateX = -((longitude / 360) * 100);
    setTranslateX(newTranslateX - 100);
  }, [longitude]);

  useEffect(() => {
    // Initialisation avec un premier trajet
    startNewJourney();
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "300vw",
          height: "100%",
          transform: `translateX(${translateX}vw)`,
          transition: "transform 0.8s ease-in-out",
        }}
      >
        <div
          style={{
            backgroundImage: "url('/Carte-Monde-Vintage_Map.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            width: "300vw",
            height: "100vh",
            backgroundPosition: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {journeys.map((journey, index) => (
            <MapEffects
              key={index}
              coordsA={journey.coordsA}
              coordsB={journey.coordsB}
              stepDistance={3}
              onJourneyEnd={() => {
                if (index === journeys.length - 1) {
                  startNewJourney();
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperPlanisphere;

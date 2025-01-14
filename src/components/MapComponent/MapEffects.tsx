import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Flag {
  coords: Coordinates;
  rating: number; // Ajout de la note
}

interface MapEffectsProps {
  coordsA: Coordinates;
  coordsB: Coordinates;
  stepDistance?: number;
  curveIntensity?: number;
  onJourneyEnd?: () => void;
}

const convertCoordsToTopAndLeftValues = (coords: Coordinates) => {
  const { latitude, longitude } = coords;
  const x = ((longitude + 180) / 360) * 100 + 100;
  const y = ((90 - latitude) / 180) * 100;
  return { top: y, left: x };
};

const generateBezierCurve = (
  start: Coordinates,
  end: Coordinates,
  controlOffset: number,
  steps: number
): Coordinates[] => {
  const control = {
    latitude: (start.latitude + end.latitude) / 2 + controlOffset,
    longitude: (start.longitude + end.longitude) / 2,
  };

  const points: Coordinates[] = [];
  for (let t = 0; t <= 1; t += 1 / steps) {
    const x =
      Math.pow(1 - t, 2) * start.longitude +
      2 * (1 - t) * t * control.longitude +
      Math.pow(t, 2) * end.longitude;
    const y =
      Math.pow(1 - t, 2) * start.latitude +
      2 * (1 - t) * t * control.latitude +
      Math.pow(t, 2) * end.latitude;
    points.push({ longitude: x, latitude: y });
  }
  return points;
};

const MapEffects: React.FC<MapEffectsProps> = ({
  coordsA,
  coordsB,
  stepDistance = 3,
  curveIntensity = 10,
  onJourneyEnd,
}) => {
  const [steps, setSteps] = useState<Coordinates[]>([]);
  const [fadeOutSteps, setFadeOutSteps] = useState<Set<number>>(new Set());
  const [flags, setFlags] = useState<Flag[]>([]);
  const [hoveredFlag, setHoveredFlag] = useState<Flag | null>(null); // Stocke le drapeau survolé


  // Génère les points de la courbe
  useEffect(() => {
    const totalDistance = Math.sqrt(
      Math.pow(coordsB.latitude - coordsA.latitude, 2) +
        Math.pow(coordsB.longitude - coordsA.longitude, 2)
    );
    const numSteps = Math.ceil(totalDistance / stepDistance);

    const curvePoints = generateBezierCurve(coordsA, coordsB, curveIntensity, numSteps);
    setSteps(curvePoints);
  }, [coordsA, coordsB, stepDistance, curveIntensity]);

  // Ajoute un drapeau avec une note lorsque la courbe est générée
  useEffect(() => {
    if (steps.length > 0) {
      setFlags((prevFlags) => [
        ...prevFlags,
        {
          coords: coordsB,
          rating: Math.floor(Math.random() * 5) + 1, // Génère une note aléatoire entre 1 et 5
        },
      ]);
    }
  }, [steps]);

const handleStepAnimationComplete = (index: number) => {
  // Vérifie si l'étape est la dernière du trajet
  const isLastStep = index === steps.length - 1;

  if (isLastStep) {
    // Délai pour laisser les steps visibles avant suppression
    setTimeout(() => {
      setFadeOutSteps(new Set([...Array(steps.length).keys()])); // Supprime tous les steps
      if (onJourneyEnd) onJourneyEnd(); // Déclenche le prochain trajet
    }, 1500); // Ajustez la durée (en millisecondes) selon vos besoins
  }
};

  

  return (
    <>
      {steps.map((step, index) => {
        const { top, left } = convertCoordsToTopAndLeftValues(step);
        const nextPoint = steps[index + 1] || coordsB;
        const angle = Math.atan2(
          nextPoint.longitude - step.longitude,
          nextPoint.latitude - step.latitude
        );
        const normalizedAngle = (angle * 180) / Math.PI;
        const flip = index % 2 === 0 ? "scaleX(1)" : "scaleX(-1)";

        return (
          <motion.div
            key={index}
            className="step"
            style={{
              position: "absolute",
              top: `${top}vh`,
              left: `${left}vw`,
              width: "10px",
              height: "10px",
              backgroundImage: 'url("/noun-footprint.svg")',
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: fadeOutSteps.has(index) ? 0 : 1,
              transform: `rotate(${normalizedAngle}deg) ${flip}`,
            }}
            transition={{
              duration: 2.5,
              delay: index * 0.2,
            }}
            onAnimationComplete={() => handleStepAnimationComplete(index)}
          />
        );
      })}

      {flags.map((flag, index) => {
        const { top, left } = convertCoordsToTopAndLeftValues(flag.coords);
        return (
          <motion.div
            key={`flag-${index}`}
            className="flag z-10"
            style={{
              position: "absolute",
              top: `${top}vh`,
              left: `${left}vw`,
              width: "20px",
              height: "20px",
              backgroundImage: 'url("/flag.svg")',
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            whileHover={{
              scale: 2,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
            }}
            onMouseEnter={() => setHoveredFlag(flag)} 
            onMouseLeave={() => setHoveredFlag(null)}
          />
        );
      })}

      {hoveredFlag && (
        <motion.div
          className="rating bg-ivory bg-opacity-40 z-20"
          style={{
            position: "absolute",
            top: `${convertCoordsToTopAndLeftValues(hoveredFlag.coords).top - 5}vh`,
            left: `${convertCoordsToTopAndLeftValues(hoveredFlag.coords).left}vw`,
            color: "black",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
          }}
        >
          ⭐ {hoveredFlag.rating}/5
        </motion.div>
      )}
    </>
  );
};

export default MapEffects;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coordinates,generateBezierCurve,convertCoordsToTopAndLeftValues } from "@/utils/Map";
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

const MapEffects: React.FC<MapEffectsProps> = ({
  coordsA,
  coordsB,
  stepDistance = 3,
  curveIntensity = 20,
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

    const curvePoints = generateBezierCurve(
      coordsA,
      coordsB,
      curveIntensity,
      numSteps
    );
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
    if (index === steps.length - 1) {
      setFadeOutSteps((prev) => {
        const newSet = new Set(prev);
        steps.forEach((_, i) => newSet.add(i));
        return newSet;
      });

      // Supprime les steps après un délai
      setTimeout(() => {
        if (onJourneyEnd) onJourneyEnd();
      }, 3000);
      setTimeout(() => {
        setSteps([]);
      }, 30000);
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
            initial={{
              opacity: 0,
              x: index % 2 === 0 ? -10 : 10, // Alterne la position de départ sur l'axe X
              y: index % 2 === 0 ? -10 : 10, // Alterne la position de départ sur l'axe Y
            }}
            animate={{
              opacity: fadeOutSteps.has(index) ? 0 : 1,
              transform: `rotate(${normalizedAngle}deg) ${flip}`,
            }}
            transition={{
              duration: 1.5,
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
            top: `${
              convertCoordsToTopAndLeftValues(hoveredFlag.coords).top - 5
            }vh`,
            left: `${
              convertCoordsToTopAndLeftValues(hoveredFlag.coords).left
            }vw`,
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
          Rate : {hoveredFlag.rating}/5
        </motion.div>
      )}
    </>
  );
};

export default MapEffects;

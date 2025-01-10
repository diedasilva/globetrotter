"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string; // Obligatoire pour lier le label et l'input
  label: string; // Label affiché avec animation
}

const validateNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

const validateEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const Input: React.FC<InputProps> = ({
  id,
  label,
  value,
  onChange,
  type,
  className,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const labelRef = useRef<HTMLLabelElement>(null);
  //const inputRef = useRef<HTMLInputElement>(null);

  
  const handleBlur = () => {
    setIsFocused(false);

    // Validation automatique basée sur le type
    if (type === "email") {
      setIsValid(validateEmail(value?.toString() || ""));
    } else if (type === "number") {
      setIsValid(validateNumber(value?.toString() || ""));
    } else {
      setIsValid(true); // Par défaut, considéré valide pour les autres types
    }
  };

  useEffect(() => {
    if (isFocused || (value && value !== "")) {
      gsap.to(labelRef.current, {
        y: -10, // Déplace le label vers le haut
        fontSize: "0.75rem", // Réduit la taille
        duration: 0.3,
        ease: "power2.out",
      });
      // Change couleur border input

    } else {
      gsap.to(labelRef.current, {
        y: 0, // Retour à la position par défaut
        fontSize: "1rem", // Taille initiale
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isFocused, value]);

  return (
    <div
        className={clsx(
        "relative w-full rounded border transition-all rounded-medium", // Styles de base
        {
            "border-gray-400": !isFocused && isValid, // Bordure grise par défaut
            "border-black": isFocused && isValid, // Bordure noire au focus et valide
            "border-red-500": !isValid, // Bordure rouge si invalide
        }
        )}
    >
      {/* Label animé */}
      <label
        ref={labelRef}
        htmlFor={id}
        className={clsx(
            "absolute left-2 top-3 pointer-events-none font-mono", // Classes par défaut
            {
                "text-mocha": isFocused && isValid, // Couleur marron au focus
                "text-red-500 font-bold": !isValid, // Couleur grise par défaut
            }
        )}
        style={{
          transition: "color 0.3s ease", // Ajoute une transition pour la couleur
        }}
      >
        {label}
      </label>

      {/* Input */}
      <input
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); handleBlur(); }}
        className={clsx(
            "w-full px-2 py-3 focus:outline-none rounded-medium", // Classes par défaut
            className // Classes passées depuis les props
          )}
        {...rest} // Passe les autres attributs d'input
      />
    </div>
  );
};

export default Input;

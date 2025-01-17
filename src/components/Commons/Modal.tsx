"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const tl = gsap.timeline();

      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      }).to(
        modalRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        "<"
      );

    } else if (!isOpen && isVisible) {

      const tl = gsap.timeline({
        onComplete: () => setIsVisible(false),
      });
      tl.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      }).to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        "<"
      );
    }
  }, [isOpen, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 rounded-soft"
      onClick={onClose}
    >
      {/* Arrière-plan sombre */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black bg-opacity-40"
        style={{ opacity: 0 }}
      ></div>

      {/* Contenu de la modal */}
      <div
        ref={modalRef}
        className={`bg-white rounded-lg w-96 shadow-lg z-10 ${className || ''}`}
        style={{ opacity: 0, scale: 0.8 }}
        onClick={(e) => e.stopPropagation()} 
            >
        {children}
      </div>
    </div>
  );
};

export default Modal;

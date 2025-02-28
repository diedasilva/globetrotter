"use client";

import { useState, useRef, useEffect } from "react";

import gsap from "gsap";
import Image from "next/image";
import Modal from "../Commons/Modal";
import DynamicModalContent from "./DynamicModalContent/DynamicModalContent";

interface CollapsibleNavProps {
  userName: string;
  userImage?: string;
  menuItems: { label: string; onClick?: () => void }[];
}

const CollapsibleNav: React.FC<CollapsibleNavProps> = ({
  userName,
  userImage,
  menuItems,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const [modalisOpen, setModalisOpen] = useState(false);
  const [modalLabel, setModalLabel] = useState<string>("");

  const buttonRef = useRef<HTMLButtonElement>(null); // Référence pour le bouton
  const [menuWidth, setMenuWidth] = useState<number>(0);

  useEffect(() => {
    if (isOpen && menuRef.current && buttonRef.current) {
      const buttonWidth = buttonRef.current.getBoundingClientRect().width;
      setMenuWidth(buttonWidth); // Définir la largeur du bouton comme largeur du menu
    }
    if (isOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    } else if (menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -10, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      console.log("click outside");
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute flex flex-row-reverse items-center justify-between w-full p-4 font-mono text-mocha">
      {/* Burger Icon */}
      <span ref={navRef}>
        <button
          ref={buttonRef}
          className={`flex flex-end items-center space-x-2 rounded-lg hover:bg-gray-100 bg-opacity-90 p-2 ${
            isOpen
              ? "bg-white rounded-button-nav-open"
              : "border border-gray-200"
          }`}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg
            className="w-6 h-6"
            fill={isOpen || isHover ? "var(--color-mocha-mousse)" : "white"}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="5" width="18" height="2" rx="1" />
            <rect x="3" y="11" width="18" height="2" rx="1" />
            <rect x="3" y="17" width="18" height="2" rx="1" />
          </svg>

          {/* User Name */}
          <span className="font-semibold">{userName}</span>

          {/* User Image */}
          <Image
            src={userImage || "/default-avatar.png"}
            alt="User Profile"
            className="rounded-full border border-white-200"
            width={32}
            height={32}
          />
        </button>
        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={menuRef}
            style={{ width: `${menuWidth}px` }}
            className="absolute right-4 top-16 bg-white border border-gray-200 rounded-div-nav-open shadow-lg bg-opacity-90"
          >
            <ul>
              {menuItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      } else {
                        setModalLabel(item.label);
                        setModalisOpen(true);
                      }
                    }}
                    className="w-full bg-transparent p-2 hover:bg-gray-100"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Modal
          isOpen={modalisOpen}
          onClose={() => setModalisOpen(false)}
          className="bg-opacity-90"
        >
          <DynamicModalContent label={modalLabel} />
        </Modal>
      </span>
    </div>
  );
};

export default CollapsibleNav;

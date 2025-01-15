import React, { ReactNode, useRef } from "react";
import { gsap } from "gsap";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "success"
    | "warning"
    | "outline"
    | "subtle";
  className?: string;
  children: ReactNode;
  animatedText?: string;
  disabled?: boolean;
  basic?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  variant = "primary",
  className = "",
  children,
  disabled,
  basic = true,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");

      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      buttonRef.current.appendChild(ripple);

      gsap.to(ripple, {
        scale: 2,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    }

    if (onClick) onClick();
  };

  //px-4 py-2
  const baseStyle =
    "relative overflow-hidden " +
    (basic ? "px-4 py-2 " : "") +
    "rounded-soft transition-all duration-300 ease-in-out focus:outline-none";
  const variants = {
    primary:
      "bg-[var(--color-mocha-mousse)] text-[var(--color-ivory)] hover:bg-[var(--color-taupe)] hover:text-[var(--color-ivory)]",
    secondary:
      "bg-[var(--color-ivory)] text-[var(--color-mocha-mousse)] hover:bg-[var(--color-mocha-mousse)]",
    tertiary:
      "text-[var(--color-ivory)] hover:text-[var(--color-mocha-mousse)] hover:bg-[var(--color-mocha-mousse)] border",
    danger:
      "bg-red-600 text-[var(--color-ivory)] hover:bg-red-700 hover:text-[var(--color-ivory)]",
    success:
      "bg-green-500 text-[var(--color-ivory)] hover:bg-green-600 hover:text-[var(--color-ivory)]",
    warning:
      "bg-orange-500 text-[var(--color-ivory)] hover:bg-orange-600 hover:text-[var(--color-ivory)]",
    outline:
      "bg-transparent text-[var(--color-mocha-mousse)] hover:bg-[var(--color-ivory)] border border-[var(--color-mocha-mousse)] hover:text-[var(--color-taupe)]",
    subtle:
      "bg-[var(--color-sand)] text-[var(--color-mocha-mousse)] hover:bg-[var(--color-taupe)] hover:text-[var(--color-ivory)]",
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      className={`${className} ${baseStyle} ${variants[variant]} `}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

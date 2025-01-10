"use client";
import Button from "@/components/Commons/Button";
import Modal from "@/components/Commons/Modal";
import AuthForm from "@/components/Auth/AuthForm";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <main className="bg-ivory min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl text-mocha mb-4">GlobeTrotter</h1>
      <p className="text-taupe text-lg my-2 font-mono">
        Discover the world and track your travels effortlessly.
      </p>
      <p className="text-taupe text-lg my-2 font-mono">
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
    </main>
  );
}

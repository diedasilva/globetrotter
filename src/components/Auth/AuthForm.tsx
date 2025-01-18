"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Commons/Button";
import Input from "@/components/Commons/Input";
import { handleLogin, registerUser } from "@/utils/AuthFunctions";

const AuthForm: React.FC = () => {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log(formData);
    setIsLoading(true);
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        setIsLoading(false);
        return;
      }

      await registerUser(
        formData.email,
        formData.password,
        formData.name,
        setError,
        setIsLoading,
        router
      );
    } else {
      await handleLogin(
        formData.email,
        formData.password,
        setError,
        setIsLoading,
        router,
      );
    }
  };

  return (
    <div className="auth-form w-full w-80">
      <div className="border-b-2 border-bt-modal py-2">
        <h2 className="text-xl font-bold">
          {isRegister ? "Create an Account" : "Welcome to Globetrotter"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        {isRegister && (
          <>
            <div>
              <Input
                id="name"
                name="name"
                label="Name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
          </>
        )}
        <div>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            label={"Email"}
            className="mt-1 p-2 w-full"
          />
        </div>
        <div>
          <Input
            id="password"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full"
          />
        </div>
        {isRegister && (
          <>
            <div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
          </>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
        {/* Affiche les erreurs */}
        <div className="space-y-2">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? (
              <div className="loader mx-auto"></div>
            ) : isRegister ? (
              "Sign Up"
            ) : (
              "Log In"
            )}
          </Button>
          <p className="text-sm text-gray-600">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setIsRegister(false)}
                  className="text-mocha hover:underline cursor-pointer"
                >
                  Log in
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => setIsRegister(true)}
                  className="text-mocha hover:underline cursor-pointer"
                >
                  Sign up
                </span>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/globe");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      alert("Account created! You can now sign in.");
      setIsSignUp(false);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create account.");
    }
  };

  return (
    <main className="bg-ivory min-h-screen flex items-center justify-center">
      <form
        className="bg-mocha text-ivory p-8 rounded-soft shadow-lg w-full max-w-md"
        onSubmit={isSignUp ? handleSignUp : handleSignIn}
      >
        <h1 className="text-3xl font-serif mb-6 text-center border-b-2 border-ivory pb-4">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        {isSignUp && (
          <div className="mb-6">
            <label className="block text-lg mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-soft border"
              placeholder="Enter your name"
              required
            />
          </div>
        )}
        <div className="mb-6">
          <label className="block text-lg mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-soft border"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-8">
          <label className="block text-lg mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-soft border"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="w-full bg-charcoal py-3 rounded-soft">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <div className="mt-6 text-center">
          <p onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </p>
          <Link href="/" className="text-ivory underline hover:text-sand mt-4 block">
            Back to Home
          </Link>
        </div>
      </form>
    </main>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-ivory min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-serif text-mocha mb-6">Welcome to Globetrotter</h1>
      <p className="text-taupe text-lg mb-10">
        Discover the world and track your travels effortlessly.
      </p>
      <div className="space-x-4">
        <Link
          href="/auth/signin"
          className="bg-charcoal text-ivory px-6 py-3 rounded-soft shadow hover:bg-mocha"
        >
          Sign In
        </Link>
        <Link
          href="/globe"
          className="bg-mocha text-ivory px-6 py-3 rounded-soft shadow hover:bg-charcoal"
        >
          Explore the Globe
        </Link>
      </div>
    </main>
  );
}

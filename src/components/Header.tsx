import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-mocha text-ivory shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-serif">
          <Link href="/">Globetrotter</Link>
        </h1>
        <nav className="space-x-6">
          <Link href="/" className="hover:text-sand">
            Home
          </Link>
          <Link href="/auth/signin" className="hover:text-sand">
            Sign In
          </Link>
          <Link href="/globe" className="hover:text-sand">
            Globe
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

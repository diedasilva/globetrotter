import React from 'react';
import Link from 'next/link';

export default function Help() {
  return (
    <div className="auth-form w-full max-w-2xl mx-auto p-2">
      <div className="border-b-2 border-bt-modal py-2 flex justify-between items-center">
        <div className="flex-1" />
        <h2 className="text-xl font-bold flex-1 text-center">Help & About</h2>
        <div className="flex-1" />
      </div>

      <div className="p-6 space-y-6">
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">About GlobeTrotter</h3>
          <p className="text-gray-600">
            GlobeTrotter is a personal project born from my passion for travel and web development. 
            It allows users to track their journeys around the world and visualize them on an interactive 3D globe.
          </p>
          <p className="text-gray-600">
            Built with Next.js, Three.js, and TypeScript, this project showcases modern web technologies 
            while providing a practical tool for travel enthusiasts.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Key Features</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Interactive 3D globe visualization</li>
            <li>Personal journey tracking</li>
            <li>Rating and review system</li>
            <li>Secure authentication</li>
          </ul>
        </section>

        <section className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Found a Bug?</h3>
          <p className="text-gray-600 mb-4">
            If you encounter any issues while using GlobeTrotter, please report them on GitHub.
          </p>
          <Link 
            href="https://github.com/YourUsername/globetrotter/issues"
            target="_blank"
            className="inline-flex items-center px-4 py-2 bg-mocha-mousse text-white rounded hover:opacity-90 transition-opacity"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 2a8 8 0 00-2.525 15.557.5.5 0 01.258.676l-1.01 2.676a.5.5 0 00.633.633l2.676-1.01a.5.5 0 01.676.258A8 8 0 1010 2zm0 12a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
            </svg>
            Report an Issue
          </Link>
        </section>
      </div>
    </div>
  );
}
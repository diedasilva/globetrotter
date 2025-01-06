import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ajouter une règle pour les fichiers GLSL
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/, // Extensions pour les shaders
      use: 'raw-loader',
    });

    return config;
  },
};

export default nextConfig;

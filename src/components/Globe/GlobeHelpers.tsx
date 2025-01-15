// GlobeHelpers.tsx
import * as THREE from "three";

/**
 * Convert latitude and longitude to a THREE.Vector3 position on a sphere.
 * @param lat Latitude in degrees
 * @param lon Longitude in degrees
 * @param radius Radius of the sphere
 * @returns THREE.Vector3 representing the 3D position
 */
export const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180); // Convert latitude to polar angle
  const theta = (lon + 180) * (Math.PI / 180); // Convert longitude to azimuthal angle

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

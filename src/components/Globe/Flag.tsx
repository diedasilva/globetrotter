"use client";

import * as THREE from "three";
import { isValidUrl, latLonToVector3 } from "./GlobeHelpers";

export function createFlag(
  lat: number,
  lon: number,
  radius: number, // Rayon du globe
  options?: {
    cityName?: string;
    flagWidth?: number;
    flagHeight?: number;
    flagColor?: string;
    flagTextureUrl?: string;
    mastHeight?: number;
    mastColor?: string;
  }
): THREE.Group {
  const {
    cityName = "",
    flagWidth = 0.5,
    flagHeight = 0.6,
    flagColor = "white",
    flagTextureUrl,
    mastHeight = 1,
    mastColor = "gray",
  } = options || {};

  // Convert latitude and longitude to cartesian coordinates
  const position = latLonToVector3(lat, lon, radius);

  // Create the flag group
  const flagGroup = new THREE.Group();
  flagGroup.position.copy(position);

  // Calculate the direction vector from the globe center to the flag
  const direction = position.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
  flagGroup.setRotationFromQuaternion(quaternion);

  // Create the mast
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, mastHeight),
    new THREE.MeshStandardMaterial({ color: mastColor })
  );
  mast.position.set(0, mastHeight / 2 - flagHeight / 2, 0);
  flagGroup.add(mast);

  // Create the flag material
  let flagMaterial;
  let isValid;
  if (flagTextureUrl) {
    isValid = isValidUrl(flagTextureUrl);
  }

  if (flagTextureUrl && isValid) {
    const textureLoader = new THREE.TextureLoader();
    const flagTexture = textureLoader.load(flagTextureUrl);
    flagMaterial = new THREE.MeshStandardMaterial({
      map: flagTexture, // Appliquer la texture
      side: THREE.DoubleSide, // Visible des deux côtés
    });
  } else {
    flagMaterial = new THREE.MeshStandardMaterial({
      color: flagColor, // Couleur par défaut
      side: THREE.DoubleSide,
    });
  }

  // Create the flag with waving effect
  const flagGeometry = new THREE.PlaneGeometry(flagWidth, flagHeight, 20, 20); // Subdivided for waves
  const flag = new THREE.Mesh(flagGeometry, flagMaterial);
  // Adjust position relative to mast
  flag.position.set(flagWidth / 2, mastHeight - flagHeight, 0);
  flagGroup.add(flag);

  // Add waving animation
  const timeOffset = Math.random() * 1000;
  flag.onBeforeRender = () => {
    const time = performance.now() / 1000 + timeOffset;
    const position = flagGeometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      position.setZ(i, Math.sin(x * 5 + time * 3) * 0.1);
    }
    position.needsUpdate = true;
  };

  // Ajouter le label (si cityName est défini)
  if (cityName) {
    const citySprite = createTextSprite(cityName);
    citySprite.position.set(0, mastHeight - flagHeight + 0.5, 0);
    flagGroup.add(citySprite);
  }
  return flagGroup;
}

function createTextSprite(
  text: string,
  parameters?: { font?: string; fillStyle?: string }
) {
  const font = parameters?.font || "30px Arial";
  const fillStyle = parameters?.fillStyle || "white";

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textBaseline = "middle";

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;

  ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });

  const sprite = new THREE.Sprite(spriteMaterial);

  sprite.scale.set(2, 0.5, 1);

  return sprite;
}

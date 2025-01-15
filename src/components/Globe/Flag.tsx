import * as THREE from "three";

/**
 * Crée un drapeau complet avec mât, texture et animation optionnelle.
 * @param texturePath - Le chemin de la texture (fichier SVG ou image).
 * @param flagSize - Taille du drapeau [width, height].
 * @param poleHeight - Hauteur du mât.
 * @returns Un groupe contenant le mât et le drapeau.
 */
export const createFlag = (
  texturePath: string,
  flagSize: [number, number] = [1, 0.6],
  poleHeight: number = 1.5
): THREE.Group => {
  const flagGroup = new THREE.Group();

  // Charger la texture pour le drapeau
  const textureLoader = new THREE.TextureLoader();
  const flagTexture = textureLoader.load(texturePath);

  // Géométrie et matériau du drapeau
  const flagGeometry = new THREE.PlaneGeometry(flagSize[0], flagSize[1], 10, 10); // Divisions pour l'animation
  const flagMaterial = new THREE.MeshBasicMaterial({
    map: flagTexture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial);
  flagMesh.position.set(flagSize[0] / 2, 0, 0); // Décalage du drapeau par rapport au mât

  // Géométrie et matériau du mât
  const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, poleHeight, 16);
  const poleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);
  poleMesh.position.set(0, -poleHeight / 2, 0); // Place le mât correctement

  // Ajout au groupe
  flagGroup.add(poleMesh);
  flagGroup.add(flagMesh);

  // Animation du drapeau (flottement)
  const animateFlag = () => {
    const time = performance.now() * 0.001;
    const vertices = flagGeometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
      const y = vertices[i + 1]; // Position Y
      vertices[i + 2] = Math.sin(time + y) * 0.05; // Vibration sur l'axe Z
    }

    flagGeometry.attributes.position.needsUpdate = true;
  };

  flagGroup.userData.animate = animateFlag;

  return flagGroup;
};

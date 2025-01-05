import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET || "your_secret_key";

// Générer un token JWT
export function generateToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

// Vérifier un token JWT
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

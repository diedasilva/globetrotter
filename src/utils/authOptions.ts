import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/utils/prisma"; // Vérifiez que cela pointe bien vers votre fichier Prisma
import { Session, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";

interface CustomUser extends User {
  id: string;
  email: string;
  name: string | null;
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        register: { label: "Register", type: "hidden" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        const { email, password, register, name } = credentials as {
          email: string;
          password: string;
          register?: string;
          name?: string;
        };

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        if (register === "true") {
          // Gestion de l'inscription
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (existingUser) {
            throw new Error("A user with this email already exists.");
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const user = await prisma.user.create({
            data: {
              email,
              name: name || null,
              password: hashedPassword,
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } else {
          // Gestion de la connexion
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            throw new Error("Invalid email or password.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }
      },
    }),
  ],
  pages: {
    signIn: "/", // Page de connexion personnalisée
    error: "/auth/error", // Page d'erreur personnalisée
  },
  secret: process.env.NEXTAUTH_SECRET, // Clé secrète pour sécuriser les sessions
  session: {
    strategy: "jwt" as SessionStrategy, // Utilisation des JWT pour les sessions
    maxAge: 30 * 24 * 60 * 60, // Durée de vie de la session (30 jours)
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // Durée de vie des JWT (30 jours)
  },
  callbacks: {
    // Ajouter des informations personnalisées à la session
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id as string,
        email: token.email || "",
        name: token.name || null,
        image: token.picture || null,
      };
      return session;
    },
    // Ajouter des données au JWT
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
};

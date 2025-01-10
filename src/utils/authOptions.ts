import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/utils/prisma"; // Assurez-vous que cette importation pointe vers votre fichier Prisma
import { Session, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  adapter: PrismaAdapter(prisma), // Connecte NextAuth à Prisma
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password, register, name } = credentials as {
          email: string;
          password: string;
          register: string;
          name?: string;
        };

        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        if (register === "true") {
          // Gérer l'inscription
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (existingUser) {
            throw new Error("User already exists");
          }

          if (!name) {
            throw new Error("Name is required for registration");
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              name,
            },
          });

          return {
            id: newUser.id.toString(),
            email: newUser.email,
            name: newUser.name,
          };
        } else {
          // Gérer la connexion
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("No user found");
          }

          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            throw new Error("Invalid email or password");
          }

          return { id: user.id.toString(), email: user.email, name: user.name };
        }
      },
    }),
  ],
  pages: {
    signIn: "/", // Page de connexion
    error: "/auth/error", // Page d'erreur personnalisée
  },
  secret: process.env.NEXTAUTH_SECRET, // Clé secrète pour sécuriser les sessions
  session: {
    strategy: "jwt" as SessionStrategy, // Utilisation de JSON Web Tokens pour les sessions
    maxAge: 30 * 24 * 60 * 60, // Durée de vie de la session : 30 jours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // Durée de vie des JWT : 30 jours
  },
  callbacks: {
    // Ajout d'informations utilisateur à la session
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id as string,
        email: token.email || "",
        name: token.name || null,
        image: token.picture || null,
      };
      return session;
    },
    // Gestion du JWT, ajout d'informations utilisateur
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

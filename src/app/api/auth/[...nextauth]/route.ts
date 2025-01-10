import NextAuth from "next-auth";
import { authOptions } from "@/utils/authOptions";

// Configure NextAuth avec les options définies dans authOptions
const handler = NextAuth(authOptions);

// Export explicite des méthodes HTTP nécessaires
export { handler as GET, handler as POST };

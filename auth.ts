import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_SECRET",
    }),
    // Add credentials provider for development/testing without real Google keys
    CredentialsProvider({
      name: "Test Account",
      credentials: {},
      async authorize() {
        return {
          id: "test-user",
          name: "Test Trader",
          email: "test@tradex.com",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=trader",
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to /simulator after successful login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/simulator`;
    },
  },
  pages: {
    signIn: "/login",
  },
});

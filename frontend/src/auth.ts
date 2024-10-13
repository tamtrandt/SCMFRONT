import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Địa chỉ API backend của bạn
const API_URL = 'http://localhost:5000'; // Thay đổi địa chỉ nếu cần



export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password", placeholder: "your-password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user: User = await res.json();

          if (!res.ok || !user) {
            throw new Error(user.message || "Invalid credentials");
          }

          return { id: user.user_id, email: user.email, name: user.username };

        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Login failed. Please try again.");
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;  // Kiểu `user.id` đã được đảm bảo là string
        token.email = user.email as string; // Kiểu `user.email` cũng được đảm bảo là string
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string; // Đảm bảo kiểu là string
      session.user.email = token.email as string; // Đảm bảo kiểu là string
      return session;
    }
  }
});
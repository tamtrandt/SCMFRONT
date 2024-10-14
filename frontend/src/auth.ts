import NextAuth, { CustomToken } from "next-auth"
import Credentials from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        name: 'Credentials',
        credentials: {
          email: {label:"Email", type:"email"},
          password: {label:"Password", type:"password"},
        },
        authorize: async (credentials) => {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
              });
      
              const user = await res.json();

  // Kiểm tra xem API trả về thông tin hợp lệ
  if (res.ok && user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      accessToken: user.accessToken,
      emailVerified: user.emailVerified,
    };
  } else {
    console.log('Invalid credentials:', user); // Log để kiểm tra thông tin trả về
    return null; // Trả về null nếu không tìm thấy người dùng
  }
            },
        }),
      ],
      pages: {
        signIn: '/auth/login', // Định nghĩa trang login của bạn
      },
      session: {
        strategy: "jwt", // Sử dụng JWT cho session
      },
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            (token as CustomToken).accessToken = user.accessToken; // Lưu accessToken vào JWT
            // Nếu có emailVerified, gán vào token
            (token as CustomToken).emailVerified = user.emailVerified || null;
          }
          return token;
        },
        async session({ session, token }) {
          session.user = {
            id: token.id as string, // Đảm bảo rằng bạn có id trong token
            email: token.email as string, // Gán email
            name: token.name as string, // Gán name
            accessToken: (token as CustomToken).accessToken, // Gán accessToken
            emailVerified: (token as CustomToken).emailVerified // Gán emailVerified nếu có
          };
          return session;
        },
      },
      secret: process.env.AUTH_SECRET,


})
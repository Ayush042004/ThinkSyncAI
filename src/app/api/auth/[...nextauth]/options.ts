import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/UserModel';


interface CustomUser {
  id: string;
  _id?: string;
  email: string;
  username: string;
  avatar?: string;
  password?: string;
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            const userId = (user._id as { toString: () => string }).toString();
            return {
              id: userId,
              _id: userId,
              username: user.username,
              email: user.email,
              image: user.avatar || null,
            };
          } else {
            throw new Error('Incorrect password');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred';
          throw new Error(errorMessage);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
async jwt({ token, user, account }) {
  if (account?.provider === 'google') {
    await dbConnect();

    let dbUser = await UserModel.findOne({ email: user.email });
    if (!dbUser) {
      const email = user?.email ?? '';
      const username = user?.name ?? (user?.email ? user.email.split('@')[0] : '');
      if (!email) return token; // skip create if no email (shouldn't happen with Google)
      dbUser = await UserModel.create({
        email,
        username,
        password: 'GOOGLE_OAUTH',
      });
    }

    token._id = (dbUser._id as { toString: () => string }).toString();
    token.username = dbUser.username;
  } else if (user) {
    const customUser = user as CustomUser;
    token._id = customUser._id?.toString?.();
    token.username = customUser.username;
  }

  return token;
},

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string | undefined;
        session.user.username = typeof token.username === 'string' ? token.username : undefined;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
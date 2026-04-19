import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            id: "google-id-token",
            name: "Google ID Token",
            credentials: {
                idToken: { label: "ID Token", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.idToken) return null;

                try {
                    const ticket = await googleClient.verifyIdToken({
                        idToken: credentials.idToken,
                        audience: process.env.GOOGLE_CLIENT_ID,
                    });

                    const payload = ticket.getPayload();
                    if (!payload || !payload.email) return null;

                    // Get user from DB or create if doesn't exist
                    const client = await clientPromise;
                    const db = client.db();
                    const users = db.collection("users");

                    let user: any = await users.findOne({ email: payload.email });

                    if (!user) {
                        const newUser = {
                            name: payload.name,
                            email: payload.email,
                            image: payload.picture,
                            emailVerified: new Date(),
                        };
                        const result = await users.insertOne(newUser);
                        return {
                            id: result.insertedId.toString(),
                            name: payload.name,
                            email: payload.email,
                            image: payload.picture,
                        };
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    };
                } catch (error) {
                    console.error("Error verifying Google ID Token:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
};

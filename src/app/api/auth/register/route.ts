import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Missing email or password" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");

        // Check if user already exists
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = {
            name: name || email.split("@")[0],
            email,
            password: hashedPassword,
            image: "https://ui-avatars.com/api/?name=" + (name || email) + "&background=random",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await users.insertOne(newUser);

        return NextResponse.json(
            { message: "User created successfully", userId: result.insertedId },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "An error occurred during registration", error: error.message },
            { status: 500 }
        );
    }
}

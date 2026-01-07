import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized - No Session" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized - No User ID in Session" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const notes = await db.collection("notes")
        .find({ userId: new ObjectId(userId) })
        .sort({ updatedAt: -1 })
        .toArray();

    return NextResponse.json(notes);
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        console.log("--- New POST Request ---");

        if (!session || !session.user) {
            console.log("❌ Error: No session found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        console.log("👤 User ID from session:", userId);

        if (!userId) {
            console.log("❌ Error: No user ID in session", session.user);
            return NextResponse.json({ error: "Session missing user ID. Please logout and login again." }, { status: 401 });
        }

        const { title, content } = await req.json();
        console.log("📝 Note Data:", { title, content });

        const client = await clientPromise;
        const db = client.db();

        const note = {
            title: title || "Untitled Note",
            content: content || "",
            userId: new ObjectId(userId),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("notes").insertOne(note);
        console.log("✅ Success: Note inserted with ID:", result.insertedId);

        return NextResponse.json({ ...note, _id: result.insertedId });
    } catch (error) {
        console.error("🔥 POST /api/notes error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

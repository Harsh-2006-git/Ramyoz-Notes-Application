import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !('id' in session.user)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const userId = session.user.id as string;

    const result = await db.collection("notes").updateOne(
        { _id: new ObjectId(id), userId: new ObjectId(userId) },
        { $set: { title, content, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note updated" });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !('id' in session.user)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const userId = session.user.id as string;

    const result = await db.collection("notes").deleteOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted" });
}

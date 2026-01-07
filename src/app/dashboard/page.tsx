import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import DashboardUI from "@/components/DashboardUI";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/");
    }

    const userId = (session.user as any).id;

    // Fetch initial notes server-side for instant load
    const client = await clientPromise;
    const db = client.db();
    const rawNotes = await db.collection("notes")
        .find({ userId: new ObjectId(userId) })
        .sort({ updatedAt: -1 })
        .toArray();

    // Serialise Mongo results for client component
    const initialNotes = rawNotes.map(note => ({
        ...note,
        _id: note._id.toString(),
        userId: note.userId.toString(),
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
    }));

    return <DashboardUI initialNotes={initialNotes} />;
}

import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
    params: Promise<{
        slug: string;
    }>;
};

// Async GET function to get the required event
export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
    try {
        await connectToDatabase();
        const { slug } = await params;

        if (!slug || typeof slug !== 'string' || slug.trim() === '')
            return NextResponse.json({ message: "Invalid or missing slug operator" }, { status: 400 })

        const sanitizedSlug = slug.trim().toLowerCase();

        // Important to use .lean() as it only gets the required javascript obj and not a Mongoose object (when you spread a mongoose obj, they do not behave the same)
        const event = await Event.findOne({ slug: sanitizedSlug }).lean();

        if (!event) {
            return NextResponse.json(
                { message: "Invalid Slug" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'event fetched successfully', event },
            { status: 200 }
        );
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown Error' }, { status: 500 })
    }
} 
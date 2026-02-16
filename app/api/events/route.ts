import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// POST function to store the event
export async function POST(req: NextRequest) {
    try {
        console.log('Starting event creation...');
        
        // Verify Cloudinary configuration
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration is incomplete. Please check your environment variables.');
        }
        
        await connectToDatabase();
        console.log('Database connected');
        
        const formData = await req.formData()
        const event = Object.fromEntries(formData.entries())
        const tags = JSON.parse(formData.get("tags") as string)
        const agenda = JSON.parse(formData.get("agenda") as string)
        
        const file = formData.get('image') as File;

        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 })

        console.log('Uploading image to Cloudinary...', { fileName: file.name, fileSize: file.size });
        
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ message: 'Image file is too large. Maximum size is 10MB.' }, { status: 400 })
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Use direct upload instead of upload_stream for better reliability
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
            resource_type: 'image',
            folder: 'DevEvent',
            timeout: 60000, // 60 seconds for larger files
        });

        console.log('Image uploaded successfully to Cloudinary');
        
        event.image = uploadResult.secure_url;
        console.log('Creating event in database...');
        
        const createdEvent = await Event.create({...event, tags:tags, agenda:agenda});
        console.log('Event created successfully:', createdEvent._id);
        
        return NextResponse.json({ message: 'Event Creation Success', event: createdEvent }, { status: 201 })
    } catch (e) {
        console.error('Event creation error:', e)
        const errorMessage = e instanceof Error ? e.message : 'Unknown Error';
        return NextResponse.json({ 
            message: 'Event Creation Failed', 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? e : undefined
        }, { status: 500 })
    }
}

// GET function to get all the events
export async function GET() {
    try {
        await connectToDatabase();
        const events = await Event.find().sort({ "createdAt": -1 });
        return NextResponse.json({ message: "Events Fetched Successfully", events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "Internal Error Occured", error: e instanceof Error ? e.message : "Unknown Error" }, { status: 500 })
    }
};
'use server';

import Event, { IEvent } from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import type { Event as EventType } from '@/types/Event';
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export const createEvent = async (formData: FormData) => {
    try {
        console.log('Starting createEvent server action...');

        // Verify Cloudinary configuration
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary configuration is incomplete. Please check your environment variables.');
        }

        await connectDB();

        const rawFormData = Object.fromEntries(formData.entries());
        const tags = JSON.parse(formData.get("tags") as string);
        const agenda = JSON.parse(formData.get("agenda") as string);

        const file = formData.get('image') as File;

        if (!file) {
            throw new Error('Image file is required');
        }

        console.log('Uploading image to Cloudinary...', { fileName: file.name, fileSize: file.size });

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

        const eventData = {
            ...rawFormData,
            tags: tags,
            agenda: agenda,
            image: uploadResult.secure_url
        };

        const customSlug = formData.get('slug') as string;
        // Basic slug validation/sanitization could go here if needed

        const createdEvent = await Event.create(eventData);
        console.log('Event created successfully:', createdEvent._id);

        return { success: true, event: { slug: createdEvent.slug } };
    } catch (error) {
        console.error('Event creation error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown Error' };
    }
}

export const getAllEvents = async (): Promise<EventType[]> => {
    try {
        await connectDB();
        const events = await Event.find().sort({ "createdAt": -1 });

        // Convert to plain objects for client components
        return events.map(event => ({
            _id: event._id.toString(),
            title: event.title,
            slug: event.slug,
            description: event.description,
            overview: event.overview,
            image: event.image,
            venue: event.venue,
            location: event.location,
            date: event.date,
            time: event.time,
            mode: event.mode,
            audience: event.audience,
            agenda: event.agenda,
            organizer: event.organizer,
            tags: event.tags,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error('Error in getAllEvents:', error);
        return [];
    }
}

export const getSimilarEventsBySlug = async (slug: string): Promise<EventType[]> => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        if (!event) {
            return [];
        }

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).limit(3);

        // Convert to plain objects for client components
        return similarEvents.map(event => ({
            _id: event._id.toString(),
            title: event.title,
            slug: event.slug,
            description: event.description,
            overview: event.overview,
            image: event.image,
            venue: event.venue,
            location: event.location,
            date: event.date,
            time: event.time,
            mode: event.mode,
            audience: event.audience,
            agenda: event.agenda,
            organizer: event.organizer,
            tags: event.tags,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error('Error in getSimilarEventsBySlug:', error);
        return [];
    }
}

export const getEventBySlug = async (slug: string): Promise<EventType | null> => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        if (!event) {
            return null;
        }

        // Convert to plain object for client components
        return {
            _id: event._id.toString(),
            title: event.title,
            slug: event.slug,
            description: event.description,
            overview: event.overview,
            image: event.image,
            venue: event.venue,
            location: event.location,
            date: event.date,
            time: event.time,
            mode: event.mode,
            audience: event.audience,
            agenda: event.agenda,
            organizer: event.organizer,
            tags: event.tags,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        };
    } catch (error) {
        console.error('Error in getEventBySlug:', error);
        return null;
    }
}

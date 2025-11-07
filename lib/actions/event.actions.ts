'use server';

import Event, { IEvent } from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export const getAllEvents = async () => {
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

export const getSimilarEventsBySlug = async (slug: string) => {
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

export const getEventBySlug = async (slug: string) => {
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

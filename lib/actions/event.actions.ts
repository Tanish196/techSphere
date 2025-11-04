'use server';

import Event, { IEvent } from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string): Promise<IEvent[]> => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });
        
        if (!event) {
            return [];
        }

        const similarEvents = await Event.find({ 
            _id: { $ne: event._id }, 
            tags: { $in: event.tags } 
        }).lean();

        // Convert to plain JavaScript objects and ensure they match IEvent type
        return similarEvents.map(event => ({
            ...event,
            _id: event._id?.toString(),
            createdAt: event.createdAt?.toISOString(),
            updatedAt: event.updatedAt?.toISOString()
        })) as unknown as IEvent[];
    } catch (error) {
        console.error('Error in getSimilarEventsBySlug:', error);
        return [];
    }
}

'use server'

import { Event } from "@/database"
import connectToDatabase from "../mongodb"
import { unstable_cache } from 'next/cache'

export const findSimilarEvents = unstable_cache(
    async (slug: string) => {
        try {
            await connectToDatabase()
            const event = await Event.findOne({ slug })
            if (!event) {
                return []
            }
            return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean()
        } catch {
            return []
        }
    },
    ['similar-events'],
    {
        revalidate: 3600,
        tags: ['similar-events']
    }
)
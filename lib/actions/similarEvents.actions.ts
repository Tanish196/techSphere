'use server'

import { Event } from "@/database"
// import connectToDatabase from "./mongodb"
import connectToDatabase from "../mongodb"
export const findSimilarEvents = async (slug: string) => {
    try {
        await connectToDatabase()
        const event = await Event.findOne({ slug })
        if (!event) {
            return []
        }
        // const similarEvents = 
        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean()
    } catch {
        return []
    }
}
'use client';

import {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string;}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await createBooking({ eventId, email });

        if(result.success) {
            setSubmitted(true);
            setEmailSent(result.emailSent || false);
            // Only capture if PostHog is loaded
            if (typeof window !== 'undefined' && posthog.__loaded) {
                posthog.capture('event_booked', { eventId, slug, email });
            }
        } else {
            console.error('Booking creation failed');
            setError(result.message || 'Failed to create booking. Please try again.');
            // Only capture if PostHog is loaded
            if (typeof window !== 'undefined' && posthog.__loaded) {
                posthog.captureException('Booking creation failed');
            }
        }
    }

    return (
        <div id="book-event">
            {submitted ? (
                <div>
                    <p className="text-sm mb-2">✅ Thank you for signing up!</p>
                    {emailSent && (
                        <p className="text-xs text-primary">
                            Check your email for event details and confirmation.
                        </p>
                    )}
                </div>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-400 mt-2">
                            ⚠️ {error}
                        </p>
                    )}

                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
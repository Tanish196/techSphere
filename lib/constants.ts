export interface EventProps {
    image: string;
    title: string;
    slug: string;
    date: string;
    time: string;
    location: string;
}

export const events: EventProps[] = [
    {
        image: "/images/event1.png",
        title: "Next.js Conf 2025",
        slug: "nextjs-conf-2025",
        date: "2025-11-15",
        time: "09:00 AM - 06:00 PM",
        location: "San Francisco, CA"
    },
    {
        image: "/images/event2.png",
        title: "React Summit",
        slug: "react-summit-2025",
        date: "2025-12-05",
        time: "10:00 AM - 07:00 PM",
        location: "New York, NY"
    },
    {
        image: "/images/event3.png",
        title: "AI & ML Conference",
        slug: "ai-ml-conference-2025",
        date: "2026-01-20",
        time: "08:30 AM - 05:30 PM",
        location: "Austin, TX"
    },
    {
        image: "/images/event4.png",
        title: "Web3 Hackathon",
        slug: "web3-hackathon-2026",
        date: "2026-02-10",
        time: "24-hour Event",
        location: "Miami, FL"
    },
    {
        image: "/images/event5.png",
        title: "DevOps Days",
        slug: "devops-days-2026",
        date: "2026-03-15",
        time: "09:30 AM - 05:00 PM",
        location: "Chicago, IL"
    },
    {
        image: "/images/event6.png",
        title: "TechSphere Annual Meetup",
        slug: "techsphere-meetup-2026",
        date: "2026-04-05",
        time: "06:00 PM - 09:00 PM",
        location: "Online"
    }
];

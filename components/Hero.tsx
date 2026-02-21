import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center gap-8 px-5 max-w-4xl mx-auto">
                {/* Main heading */}
                <h1 className="text-gradient text-7xl font-bold max-sm:text-5xl leading-tight">
                    Dive into the world of Tech
                </h1>
                
                {/* Subheading */}
                <p className="text-light-100 text-xl max-sm:text-base max-w-2xl">
                    Welcome to TechSphere - Your gateway to the most exciting developer events, conferences, and workshops around the globe
                </p>
                
                {/* CTA Buttons */}
                <div className="flex gap-4 mt-6 flex-wrap justify-center">
                    <Link 
                        href="/events" 
                        className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2"
                    >
                        Explore Events
                        <Image src="/icons/arrow-down.svg" alt="arrow" width={20} height={20} className="rotate-[-90deg]" />
                    </Link>
                    
                    <Link 
                        href="/events/create" 
                        className="bg-dark-100 border border-dark-200 text-white font-semibold px-8 py-4 rounded-full hover:border-primary/50 transition-all duration-300"
                    >
                        Create Event
                    </Link>
                </div>
                
                {/* Stats or features */}
                <div className="flex gap-12 mt-12 flex-wrap justify-center">
                    <div className="flex flex-col items-center">
                        <p className="text-4xl font-bold text-primary">100+</p>
                        <p className="text-light-200 text-sm mt-1">Events</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-4xl font-bold text-primary">50+</p>
                        <p className="text-light-200 text-sm mt-1">Cities</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-4xl font-bold text-primary">10K+</p>
                        <p className="text-light-200 text-sm mt-1">Attendees</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

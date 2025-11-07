'use client';

import Image from "next/image";

const ExploreBtn = () => {
    const handleClick = () => {
        const eventsSection = document.querySelector('#events');
        if (eventsSection) {
            eventsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <button 
            type="button" 
            id="explore-btn" 
            className="mt-7 mx-auto" 
            onClick={handleClick}
        >
            Explore Events
            <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
        </button>
    )
}

export default ExploreBtn

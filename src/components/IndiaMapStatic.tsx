'use client';
import React from 'react';
import Image from 'next/image';

const markers = [
    { name: 'Jammu', top: '12%', left: '25%' },
    { name: 'Dharamshala', top: '18%', left: '34%' },
    { name: 'Amritsar', top: '20%', left: '26%' },
    { name: 'Dehradun', top: '24%', left: '37%' },
    { name: 'Jaipur', top: '33%', left: '26%' },
    { name: 'Udaipur', top: '38%', left: '20%' },
    { name: 'Vadodara', top: '46%', left: '12%' },
    { name: 'Delhi', top: '29%', left: '32%' },
    { name: 'Pune', top: '58%', left: '20%' },
    { name: 'Hyderabad', top: '62%', left: '37%' },
    { name: 'Kolkata', top: '47%', left: '68%' },
];

export default function IndiaMapStatic() {
    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <Image src="/india-map.png" alt="India Map" width={1800} height={1500} />
            {markers.map((marker, index) => (
                <div
                    key={index}
                    className="absolute flex flex-col items-center group"
                    style={{ top: marker.top, left: marker.left, transform: 'translate(-50%, -100%)' }} 
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-red-600 hover:scale-110 transition-transform duration-200"
                        fill="currentColor"
                        viewBox="0 0 384 512"
                    >
                        <path d="M168 0C75.2 0 0 75.2 0 168c0 87.5 130.4 222.4 154.7 245.5 7.2 6.8 18.4 6.8 25.6 0C217.6 390.4 348 255.5 348 168 348 75.2 272.8 0 168 0zm0 240c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72-32.2 72-72 72z" />
                    </svg>
                    <div className="absolute bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 mt-6 whitespace-nowrap">
                        {marker.name}
                    </div>
                </div>
            ))}
        </div>
    );
}
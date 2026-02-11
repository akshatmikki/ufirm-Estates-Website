"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export const TrackComplaints = () => {
    return (
        <motion.a
            href="https://admin.urest.in:8092/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.6, scale: 1 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-20 right-6 z-[9998] p-3 rounded-full bg-[#0E6F7F] text-white shadow-lg cursor-pointer transition-colors duration-300 hidden lg:flex items-center justify-center"

            title="Track Complaints"
        >
            <Compass className="w-6 h-6" />
        </motion.a>
    );
};

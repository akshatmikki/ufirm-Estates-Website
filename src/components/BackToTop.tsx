"use client";
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    whileTap={{ scale: 0.9, backgroundColor: "#006990" }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-[9999] p-3 rounded-full bg-[#1e3143] text-white shadow-lg cursor-pointer transition-colors duration-300"
                >
                    <ArrowUp className="w-6 h-6" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

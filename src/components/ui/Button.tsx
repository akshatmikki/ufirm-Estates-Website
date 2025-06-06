"use client";
import React, { useRef } from "react";
import {
    motion,
    useAnimationFrame,
    useMotionTemplate,
    useMotionValue,
    useTransform,
} from "framer-motion";
import { cn } from "@/utils/cn";

type ButtonProps<T extends React.ElementType = "button"> = {
    borderRadius?: string;
    children: React.ReactNode;
    as?: T;
    containerClassName?: string;
    borderClassName?: string;
    duration?: number;
    className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>;

export function Button<T extends React.ElementType = "button">({
    borderRadius = "2.50rem",
    children,
    as,
    containerClassName,
    borderClassName,
    duration,
    className,
    ...otherProps
}: ButtonProps<T>) {
    const Component = as || "button";
    return React.createElement(
        Component,
        {
            className: cn(
                "bg-transparent relative text-xl h-12 w-30 p-[1px] overflow-hidden",
                containerClassName
            ),
            style: {
                borderRadius: borderRadius,
            },
            ...otherProps,
        },
        <>
            <div
                className="absolute inset-0"
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                <MovingBorder duration={duration} rx="30%" ry="30%">
                    <div
                        className={cn(
                            "h-40 w-40 opacity-90 rainbow-animate",
                            "bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.8)_10%,rgba(255,154,0,0.8)_25%,rgba(208,222,33,0.8)_40%,rgba(79,220,74,0.8)_55%,rgba(63,218,216,0.8)_70%,rgba(47,201,226,0.8)_85%,rgba(28,127,238,0.8)_95%,rgba(95,21,242,0.8)_100%)]",
                            borderClassName
                        )}
                    />
                </MovingBorder>
            </div>

            <div
                className={cn(
                    "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm font-semibold antialiased",
                    className
                )}
                style={{
                    borderRadius: `calc(${borderRadius} * 0.96)`,
                }}
            >
                {children}
            </div>
        </>
    );
}

type MovingBorderProps = {
    children: React.ReactNode;
    duration?: number;
    rx?: string;
    ry?: string;
} & React.SVGProps<SVGSVGElement>;

export const MovingBorder = ({
    children,
    duration = 2000,
    rx,
    ry,
    ...otherProps
}: MovingBorderProps) => {
    const pathRef = useRef<SVGRectElement | null>(null);
    const progress = useMotionValue<number>(0);

    useAnimationFrame((time) => {
        const length = pathRef.current?.getTotalLength();
        if (length) {
            const pxPerMillisecond = length / duration;
            progress.set((time * pxPerMillisecond) % length);
        }
    });

    const x = useTransform(
        progress,
        (val) => pathRef.current?.getPointAtLength(val)?.x ?? 0
    );
    const y = useTransform(
        progress,
        (val) => pathRef.current?.getPointAtLength(val)?.y ?? 0
    );

    const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute h-full w-full"
                width="100%"
                height="100%"
                {...otherProps}
            >
                <rect
                    fill="none"
                    width="100%"
                    height="100%"
                    rx={rx}
                    ry={ry}
                    ref={pathRef}
                />
            </svg>
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    transform,
                }}
            >
                {children}
            </motion.div>
        </>
    );
};
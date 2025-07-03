"use client";
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";

interface SlideData {
  title: string;
  buttonLabel?: string;
  src: string;
  href?: string;
  extraButtonLabel?: string;
  extraButtonHref?: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const [animate, setAnimate] = useState(false);

  const { src, title, buttonLabel, href, extraButtonLabel, extraButtonHref } = slide;
  const isCurrent = current === index;

  useEffect(() => {
    if (isCurrent) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isCurrent]);

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  return (
    <li
      ref={slideRef}
      className="relative flex-shrink-0 w-screen h-[100dvh] min-h-screen px-4 sm:px-6 md:px-8 text-white transition-all duration-2000 ease-in-out cursor-pointer"
      onClick={() => handleSlideClick(index)}
    >
      <div className="absolute inset-0 bg-black/40 z-10" />
      <Image
        src={src}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-2000 ease-in-out"
        style={{ opacity: isCurrent ? 1 : 0.5 }}
        fill
        onLoad={imageLoaded}
        loading="eager"
        decoding="sync"
      />

      {isCurrent && (
        <article
          className={`relative z-20 px-4 sm:px-6 md:px-10 py-8 max-w-[90%] sm:max-w-2xl text-left flex flex-col justify-center h-full ${
            animate ? "animate-slide-in-left" : ""
          }`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            {title}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {href && (
              <Link href={href} className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto text-center"
                  borderClassName="px-4 sm:px-6 py-3 bg-black/75 dark:bg-black/75 border-slate-800"
                  borderRadius="1.75rem"
                >
                  {buttonLabel} <span className="ml-2">&rarr;</span>
                </Button>
              </Link>
            )}

            {index === 0 && extraButtonLabel && extraButtonHref && (
              <Link href={extraButtonHref} className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto text-center"
                  borderClassName="px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 border-slate-800"
                  borderRadius="1.75rem"
                >
                  {extraButtonLabel} <span className="ml-2">&rarr;</span>
                </Button>
              </Link>
            )}
          </div>
        </article>
      )}
    </li>
  );
};

interface CarouselProps {
  slides: SlideData[];
  current: number;
  onSlideChange: (index: number) => void;
}

export function Carousel({ slides, current, onSlideChange }: CarouselProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      onSlideChange((current + 1) % slides.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [current, onSlideChange, slides.length]);

  const id = useId();

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      onSlideChange(index);
    }
  };

  return (
    <div
      className="relative w-full h-[100dvh] min-h-screen overflow-hidden"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}vw)`,
          width: `${slides.length * 100}vw`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideClick(index)}
            className={`w-2.5 h-2.5 rounded-full ${
              index === current ? "bg-white scale-125" : "bg-white/40"
            } transition-transform duration-200`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
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

  const { src, title, buttonLabel, href } = slide;
  const isCurrent = current === index;

  useEffect(() => {
    if (isCurrent) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isCurrent]);

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  return (
    <li
      ref={slideRef}
      className="relative flex-shrink-0 w-screen h-screen px-7 text-white transition-all duration-2000 ease-in-out cursor-pointer"
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
          className={`relative z-20 px-6 lg:px-10 py-8 max-w-2xl text-left flex flex-col justify-center h-full
            ${animate ? "animate-slide-in-left" : ""}`}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl sm:text-xl font-bold relative dark:text-white text-white ">
            {title}
          </h2>
          {href && (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8"
            >
              <Button borderClassName="px-6 py-3 relative w-fit text-left block mx-auto md:mx-0 sm:text-sm text-white bg-black/75 dark:bg-black/75 text-white border-slate-800 dark:border-slate-800 h-18 border border-transparent text-lg " borderRadius="1.75rem">
                {buttonLabel} <span aria-hidden="true" className="ml-2">&rarr;</span>
              </Button>
            </Link>
          )}
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
    }, 7000);

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
      className="relative w-full h-full overflow-hidden"
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

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideClick(index)}
            className={`w-3 h-3 rounded-full ${index === current ? "bg-white scale-125" : "bg-white/40"
              } transition transform duration-200`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
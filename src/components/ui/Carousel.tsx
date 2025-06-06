// Slide.tsx or within Carousel.tsx
"use client";
import { useState, useRef, useId, useEffect } from "react";
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
      const timer = setTimeout(() => setAnimate(false), 600); // Match your CSS animation duration
      return () => clearTimeout(timer);
    }
  }, [isCurrent]);

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  return (
    <li
      ref={slideRef}
      className="relative flex-shrink-0 w-screen h-[550px] px-7 text-white transition-all duration-300 ease-in-out"
      onClick={() => handleSlideClick(index)}
    >
      <div className="absolute inset-0 bg-black/40 z-10" />
      <img
        src={src}
        alt={title}
        className="absolute inset-0 w-full h-[550px] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
        style={{ opacity: isCurrent ? 1 : 0.5 }}
        onLoad={imageLoaded}
        loading="eager"
        decoding="sync"
      />

      {isCurrent && (
        <article
          className={`relative z-20 px-6 lg:px-10 py-8 max-w-2xl text-left flex flex-col justify-center h-full
            ${animate ? "animate-slide-in-left" : ""}`}
        >
          <h4 className="text-3xl md:text-3xl mb-4 font-bold leading-snug text-left">
            {title}
          </h4>
          {buttonLabel && (
            href ? (
              <a href={href} className="w-fit text-left mt-4 block">
                <Button
                  borderRadius="2.50rem"
                  className="bg-yellow-400 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                >
                  {buttonLabel} <span aria-hidden="true">&rarr;</span>
                </Button>
              </a>
            ) : (
              <div className="mt-4">
                <Button
                  borderRadius="2.50rem"
                  className="bg-yellow-400 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                >
                  {buttonLabel} <span aria-hidden="true">&rarr;</span>
                </Button>
              </div>
            )
          )}
        </article>
      )}
    </li>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const id = useId();

  return (
    <div
      className="relative w-full h-[550px] overflow-hidden"
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
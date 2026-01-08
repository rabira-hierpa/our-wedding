"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface StoryMoment {
  id: number;
  title: string;
  description: string;
  image: string;
  date?: string;
  orientation: "left" | "right";
}

const storyMoments: StoryMoment[] = [
  {
    id: 1,
    title: "The Beginning",
    description:
      "Every love story has a beginning, and ours started with a moment that felt like destiny. Two hearts finding each other in the beautiful journey of life.",
    image: "/story/photo1.jpeg",
    date: "Where it all began",
    orientation: "left",
  },
  {
    id: 2,
    title: "Growing Together",
    description:
      "Through every season, every moment, we discovered that together we are stronger. Hand in hand, we walked through life's beautiful adventures.",
    image: "/story/photo2.jpeg",
    date: "Building our foundation",
    orientation: "right",
  },
  {
    id: 3,
    title: "Adventures Await",
    description:
      "Life became an adventure worth living. Every step we took together brought us closer, every laugh made our bond stronger.",
    image: "/story/photo3.jpeg",
    date: "Creating memories",
    orientation: "left",
  },
  {
    id: 4,
    title: "A Love That Lasts",
    description:
      "In every glance, in every touch, we found forever. A love that grows deeper with each passing day.",
    image: "/story/photo4.jpeg",
    date: "Forever begins",
    orientation: "right",
  },
  {
    id: 5,
    title: "Walking Together",
    description:
      "Side by side, heart to heart, we continue our journey. Every path becomes beautiful when walked together.",
    image: "/story/photo5.jpeg",
    date: "Our journey",
    orientation: "left",
  },
  {
    id: 6,
    title: "Forever Yours",
    description:
      "And so our story continues, chapter by chapter, moment by moment. This is just the beginning of our forever.",
    image: "/story/photo6.jpeg",
    date: "Forever and always",
    orientation: "right",
  },
];

export default function OurStory() {
  const [visibleMoments, setVisibleMoments] = useState<number[]>([]);
  const momentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = momentRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleMoments((prev) => [...new Set([...prev, index])]);
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-theme-gradient-start via-theme-gradient-mid to-theme-gradient-end">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-theme-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-theme-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-32">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-theme-accent" />
              <span className="text-theme-accent font-medium tracking-widest text-sm uppercase">
                Our Journey
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-theme-accent" />
            </div>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-theme-text-primary mb-6">
            Our Love Story
          </h2>
          <p className="text-theme-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A beautiful journey of two souls becoming one
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-7xl mx-auto">
          {/* Center Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-theme-border-accent via-theme-primary/30 to-theme-border-accent transform -translate-x-1/2">
            {/* Animated dots along the line */}
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-theme-accent rounded-full transform -translate-x-1/2 animate-pulse shadow-lg" />
            <div
              className="absolute top-1/4 left-1/2 w-2 h-2 bg-theme-primary rounded-full transform -translate-x-1/2 animate-pulse shadow-lg"
              style={{ animationDelay: "0.15s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-3 h-3 bg-theme-accent rounded-full transform -translate-x-1/2 animate-pulse shadow-lg"
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className="absolute top-3/4 left-1/2 w-2 h-2 bg-theme-primary rounded-full transform -translate-x-1/2 animate-pulse shadow-lg"
              style={{ animationDelay: "0.45s" }}
            />
          </div>

          {/* Story Moments */}
          <div className="space-y-24 md:space-y-32">
            {storyMoments.map((moment, index) => (
              <div
                key={moment.id}
                ref={(el) => {
                  momentRefs.current[index] = el;
                }}
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  moment.orientation === "right" ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image Side */}
                <div
                  className={`w-full md:w-1/2 transition-all duration-1000 ${
                    visibleMoments.includes(index)
                      ? "opacity-100 translate-x-0 translate-y-0"
                      : moment.orientation === "left"
                      ? "opacity-0 -translate-x-20"
                      : "opacity-0 translate-x-20"
                  }`}
                >
                  <div className="relative group">
                    {/* Decorative Frame */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-theme-accent/20 via-theme-primary/20 to-theme-primary-light/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

                    {/* Image Container */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={moment.image}
                        alt={moment.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index < 2}
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Decorative Corner Elements */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-theme-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-theme-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Center Timeline Dot (Desktop) */}
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div
                    className={`w-6 h-6 bg-theme-surface border-4 border-theme-accent rounded-full shadow-lg transition-all duration-500 ${
                      visibleMoments.includes(index) ? "scale-100" : "scale-0"
                    }`}
                  >
                    <div className="absolute inset-0 bg-theme-accent rounded-full animate-ping opacity-20" />
                  </div>
                </div>

                {/* Content Side */}
                <div
                  className={`w-full md:w-1/2 transition-all duration-1000 delay-300 ${
                    visibleMoments.includes(index)
                      ? "opacity-100 translate-x-0 translate-y-0"
                      : moment.orientation === "right"
                      ? "opacity-0 -translate-x-20"
                      : "opacity-0 translate-x-20"
                  }`}
                >
                  <div
                    className={`${
                      moment.orientation === "right" ? "md:text-right" : ""
                    }`}
                  >
                    {/* Date Badge */}
                    {moment.date && (
                      <div
                        className={`inline-block mb-4 px-6 py-2 bg-gradient-to-r from-theme-surface-tertiary to-theme-border-accent rounded-full border border-theme-border-accent ${
                          moment.orientation === "right"
                            ? "md:float-right md:ml-4"
                            : ""
                        }`}
                      >
                        <span className="text-theme-accent font-medium text-sm tracking-wide">
                          {moment.date}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-theme-text-primary mb-4 clear-both">
                      {moment.title}
                    </h3>

                    {/* Decorative Line */}
                    <div
                      className={`h-1 w-20 bg-gradient-to-r from-theme-accent to-theme-primary rounded-full mb-6 ${
                        moment.orientation === "right" ? "md:ml-auto" : ""
                      }`}
                    />

                    {/* Description */}
                    <p className="text-theme-text-secondary text-lg leading-relaxed">
                      {moment.description}
                    </p>

                    {/* Decorative Quote Mark */}
                    <div
                      className={`mt-6 text-6xl font-serif text-theme-border-accent leading-none ${
                        moment.orientation === "right" ? "md:text-right" : ""
                      }`}
                    >
                      ❝
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Closing Heart */}
          <div className="text-center mt-32 relative">
            {/* Extend timeline to heart */}
            <div className="hidden md:block absolute left-1/2 top-0 w-0.5 h-16 bg-gradient-to-b from-theme-primary/30 to-transparent transform -translate-x-1/2" />

            <div className="relative z-10 flex flex-col items-center pt-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-theme-accent to-theme-accent-dark rounded-full shadow-2xl animate-pulse">
                <svg
                  className="w-10 h-10 text-theme-text-inverse"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="mt-6 font-serif text-2xl text-theme-text-secondary italic">
                And they lived happily ever after...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-primary/30 to-transparent" />
    </section>
  );
}

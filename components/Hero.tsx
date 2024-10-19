"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import styles from "./Hero.module.css";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const sliderData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBldHN8ZW58MHx8MHx8fDA%3D",
    title: "Pets",
  },
  {
    id: 2,
    image:
      "https://media.istockphoto.com/id/1138747364/photo/asian-woman-cleaning-face-front-of-mirror-skin-care-and-cosmetic-removal-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=RM0ClhINWxSJt96rC8_SbvKGlwW0Oplo1mqZaijE3iY=",
    title: "Beauty and Skincare",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZpdG5lc3MlMjBhbmQlMjB3ZWxsbmVzc3xlbnwwfHwwfHx8MA%3D%3D",
    title: "Fitness and Wellness",
  },
  {
    id: 4,
    image:
      "https://media.istockphoto.com/id/1255615584/photo/woman-is-coloring-a-chair-at-home.jpg?s=612x612&w=0&k=20&c=xcJ2UPVRWmcD3ot8MV2uUsOVtGKwRgaylTi2R0uDTkc=",
    title: "DIY Projects",
  },
  {
    id: 5,
    image:
      "https://media.istockphoto.com/id/1363307557/photo/cute-young-black-woman-wearing-a-cool-blue-winter-top.jpg?s=612x612&w=0&k=20&c=FN_XldzTMVi4mmZWTns7Nasy5HU3nCsEaynx52gZinI=",
    title: "Fashion",
  },
];

export function Hero() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [backgroundImage, setBackgroundImage] = useState(sliderData[0].image);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId: number;
    let startTime: number;
    const duration = 30000; // Reduced from 60000 to 30000 (30 seconds per full cycle)
    const totalImages = sliderData.length;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      
      // Update slider position
      const translateX = -progress * (slider.scrollWidth / 2);
      slider.style.transform = `translateX(${translateX}px)`;

      // Update background image and active index
      const imageIndex = Math.floor(progress * totalImages);
      const newBackgroundImage = sliderData[imageIndex].image;
      setBackgroundImage(newBackgroundImage);
      setActiveIndex(imageIndex);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Duplicate the slider items to create an infinite loop effect
  const extendedSliderData = [...sliderData, ...sliderData];

  const getDescription = (title: string) => {
    const commonStart = "Explore the latest:";
    switch (title) {
      case "Pets":
        return [commonStart, "adorable pet moments."];
      case "Beauty and Skincare":
        return [commonStart, "glow-up tips."];
      case "Fitness and Wellness":
        return [commonStart, "ways to boost your energy."];
      case "DIY Projects":
        return [commonStart, "creative hacks."];
      case "Fashion":
        return [commonStart, "style trends and tips."];
      default:
        return [commonStart, "content from multiple platforms."];
    }
  };

  return (
    <div 
      className={styles.heroContainer}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={styles.overlay} />
      <div className={styles.heroContent}>
        <h1 className={`${styles.neonText} text-5xl font-bold mb-4`}>
          Create. Inspire. Connect.
        </h1>
        <Link href="/auth/signup">
          <Button size="lg" className={styles.ctaButton}>
            Get Started
          </Button>
        </Link>
      </div>
      <div className={styles.descriptionContent}>
        <h2 className={`${styles.neonText} ${styles.pinkNeon} text-2xl font-bold mb-2`}>
          {getDescription(sliderData[activeIndex].title)[0]}
        </h2>
        <p className={`${styles.largeText} text-white font-bold italic`}>
          {getDescription(sliderData[activeIndex].title)[1]}
        </p>
      </div>
      <div className={styles.sliderContainer}>
        <div className={styles.slider}>
          <div className={styles.sliderTrack} ref={sliderRef}>
            {extendedSliderData.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className={`${styles.card} ${index % sliderData.length === activeIndex ? styles.active : ''}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={300}
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.cardContent}>
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

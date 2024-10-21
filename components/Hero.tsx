"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import styles from "./Hero.module.css";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const sliderData = [
  {
    id: 1,
    image: "/images/Pets.jpg",
    title: "Pets",
  },
  {
    id: 2,
    image: "/images/Skincare.jpg",
    title: "Beauty and Skincare",
  },
  {
    id: 3,
    image: "/images/Wellness.jpg",
    title: "Fitness and Wellness",
  },
  {
    id: 4,
    image: "/images/Family Cooking.jpg",
    title: "Family Cooking",
  },
  {
    id: 5,
    image: "/images/Fashion.jpg",
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
        return [commonStart, "family friendly recipes."];
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
        backgroundSize: "contain", // Changed from "cover" to "contain"
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat", // Add this line
        backgroundColor: "black", // Optional: adds a background color
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
        <h2
          className={`${styles.neonText} ${styles.pinkNeon} text-2xl font-bold mb-2`}
        >
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
                className={`${styles.card} ${
                  index % sliderData.length === activeIndex ? styles.active : ""
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={300}
                  style={{ objectFit: "cover" }}
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

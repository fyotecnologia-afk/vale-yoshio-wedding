"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import weddingData from "@/data/weddingData.json";
import styles from "@/styles/Welcome.module.css";

const Welcome: React.FC = () => {
  const { slides } = weddingData;

  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.8 },
    });

    if (imageRef.current) {
      tl.from(imageRef.current, { opacity: 0, scale: 1 });
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* Solo imagen */}
      <div ref={imageRef} className={styles.imageWrapper}>
        <img src={slides[1]} alt="Wedding" className={styles.image} />
      </div>
    </div>
  );
};

export default Welcome;

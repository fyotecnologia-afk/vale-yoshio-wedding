"use client";

import React, { useState, useRef, useEffect } from "react";
import weddingData from "@/data/weddingData.json";
import styles from "@/styles/TrailAnimation.module.css";
import { TypeAnimation } from "react-type-animation";

export default function ParallaxQuote() {
  const frase = weddingData?.frase ?? "NOS ELEGIMOS PARA SIEMPRE";
  const [startAnimation, setStartAnimation] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnimation(true);
          observer.disconnect(); // solo una vez
        }
      },
      { threshold: 0.5 } // empieza cuando el 50% del elemento es visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.quoteWrapper}>
        {startAnimation && (
          <TypeAnimation
            sequence={[frase, 1000]}
            wrapper="span"
            cursor={false}
            speed={50}
            className={styles.quoteText}
          />
        )}
      </div>
    </div>
  );
}

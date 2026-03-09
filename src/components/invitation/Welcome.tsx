"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import weddingData from "@/data/weddingData.json";
import styles from "@/styles/Welcome.module.css";

const Welcome: React.FC = () => {
  const { names, date, slides } = weddingData;

  const mesesAbreviados = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];

  const eventDate = new Date(date);
  const dia = String(eventDate.getDate()).padStart(2, "0");
  const mes = mesesAbreviados[eventDate.getMonth()];
  const año = eventDate.getFullYear();

  const formattedDate = `${dia}.${mes}.${año}`;

  // Refs para los elementos que quieres animar
  const headerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.8 },
    });

    if (
      headerRef.current &&
      subtitleRef.current &&
      imageRef.current &&
      dateRef.current
    ) {
      tl.from(headerRef.current, { opacity: 0, y: 20 })
        .from(subtitleRef.current, { opacity: 0, y: 20 }, "-=0.5")
        .from(imageRef.current, { opacity: 0, scale: 1 }, "-=0.4")
        .from(dateRef.current, { opacity: 0, y: 20 }, "-=0.4");
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* Nombres */}
      <div ref={headerRef} className={styles.header}>
        <h1 className={styles.names}>{names}</h1>
        <h2 ref={subtitleRef} className={styles.subtitle}>
          WEDDING
        </h2>
      </div>

      {/* Imagen */}
      <div ref={imageRef} className={styles.imageWrapper}>
        <img src={slides[0]} alt="Wedding" className={styles.image} />
      </div>

      {/* Fecha */}
      <p ref={dateRef} className={styles.date}>
        {formattedDate}
      </p>
    </div>
  );
};

export default Welcome;

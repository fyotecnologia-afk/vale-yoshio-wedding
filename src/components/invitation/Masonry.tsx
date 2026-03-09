"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import styles from "@/styles/Mansory.module.css";

export default function MansoryGallery() {
  const [open, setOpen] = useState(false);

  const slides = [
    { src: "/images/mansory/gallery-15.webp" },
    { src: "/images/mansory/gallery-14.webp" },
    { src: "/images/mansory/gallery-13.webp" },
    { src: "/images/mansory/gallery-12.webp" },
    { src: "/images/mansory/gallery-11.webp" },
    { src: "/images/mansory/gallery-10.webp" },
    { src: "/images/mansory/gallery-9.webp" },
    { src: "/images/mansory/gallery-8.webp" },
    { src: "/images/mansory/gallery-7.webp" },
    { src: "/images/mansory/gallery-6.webp" },
    { src: "/images/mansory/gallery-5.webp" },
    { src: "/images/mansory/gallery-4.webp" },
    { src: "/images/mansory/gallery-3.webp" },
    { src: "/images/mansory/gallery-2.webp" },
    { src: "/images/mansory/gallery-1.webp" },
  ];

  return (
    <>
      {/* Imagen + botón centrados */}
      <div className={styles.galleryContainer}>
        <div style={{ position: "relative" }}>
          <img
            src={slides[0].src}
            alt="foto principal"
            className={styles.previewImage}
            onClick={() => setOpen(true)}
          />

          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir galería"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0,0,0,0.6)",
              border: "none",
              borderRadius: "50%",
              width: 50,
              height: 50,
              color: "white",
              fontSize: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 8px rgba(0,0,0,0.5)",
              userSelect: "none",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Texto debajo y fuera del flex */}
      <p
        style={{
          marginTop: "-20px",
          fontSize: "clamp(.5rem, 2vw, 1.4rem)",
          color: "#555",
          textAlign: "center",
        }}
        className="title-manjari"
      >
        Descubre más fotos de este momento especial
      </p>

      <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
    </>
  );
}

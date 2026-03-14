"use client";

import React from "react";
import styles from "@/styles/Separador.module.css";

type SeparadorProps = {
  src: string;
  alt?: string;
  width?: number;
  position?: "center" | "left" | "right";
  overlap?: number;

  flipX?: boolean;
  flipY?: boolean;
  rotate?: number;

  offsetX?: number;
  offsetY?: number;

  layer?: "front" | "back"; // 👈 nuevo parámetro
};

const Separador: React.FC<SeparadorProps> = ({
  src,
  alt = "decoración",
  width = 180,
  position = "center",
  overlap = 60,
  flipX = false,
  flipY = false,
  rotate = 0,
  offsetX = 0,
  offsetY = 0,
  layer = "front", // default
}) => {
  const scaleX = flipX ? -1 : 1;
  const scaleY = flipY ? -1 : 1;

  const transform = `
    translate(${offsetX}px, ${offsetY}px)
    scaleX(${scaleX})
    scaleY(${scaleY})
    rotate(${rotate}deg)
  `;

  const zIndex = layer === "front" ? 10 : "unset";

  return (
    <div
      className={`${styles.wrapper} ${styles[position]}`}
      style={{
        marginBottom: `-${overlap}px`,
        position: "relative",
        zIndex,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: `${width}px`,
          transform,
        }}
      />
    </div>
  );
};

export default Separador;

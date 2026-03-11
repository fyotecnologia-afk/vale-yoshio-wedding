"use client";

import React, { useEffect, useState } from "react";
import weddingData from "@/data/weddingData.json";
import styles from "@/styles/Countdown.module.css";

const Countdown = () => {
  const { date } = weddingData;

  const calculateTimeLeft = () => {
    const difference = +new Date(date) - +new Date();

    if (difference <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    return {
      days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0",
      ),
      hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(
        2,
        "0",
      ),
      minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(
        2,
        "0",
      ),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.timer}>
      <div className={styles.block}>
        <span className={styles.label}>{timeLeft.days}</span>
        <small>Días</small>
      </div>

      <div className={styles.block}>
        <span className={styles.label}>{timeLeft.hours}</span>
        <small>Horas</small>
      </div>

      <div className={styles.block}>
        <span className={styles.label}>{timeLeft.minutes}</span>
        <small>Min</small>
      </div>

      <div className={styles.block}>
        <span className={styles.label}>{timeLeft.seconds}</span>
        <small>Seg</small>
      </div>
    </div>
  );
};

export default Countdown;

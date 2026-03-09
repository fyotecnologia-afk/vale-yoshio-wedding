import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";

const MusicPlayer: React.FC<{ src: string }> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(false);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (!canAutoplay && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setCanAutoplay(true);
          })
          .catch(() => {
            // Usuario interactuó pero no permitió autoplay
            setCanAutoplay(true);
          });
      }
    };

    // Espera la primera interacción
    document.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, [canAutoplay]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const { scale } = useSpring({
    loop: isPlaying ? { reverse: true } : false,
    to: { scale: 1.1 },
    from: { scale: 1 },
    config: { tension: 200, friction: 10 },
  });

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <animated.button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        style={{
          transform: scale.to((s) => `scale(${s})`),
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "transparent",
          border: "none",
          width: 50,
          height: 50,
          padding: 0,
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        <img
          src={isPlaying ? "/icons/pause.svg" : "/icons/play.svg"}
          alt={isPlaying ? "Pausar" : "Reproducir"}
          style={{ width: "100%", height: "100%" }}
        />
      </animated.button>
    </>
  );
};

export default MusicPlayer;

// pages/index.tsx
import { useSpring, animated, config, useTrail } from "@react-spring/web";
import { Typography, Space } from "antd";
import { useState, useEffect } from "react";

const { Title, Paragraph } = Typography;

export default function Home() {
  const [hover, setHover] = useState(false);
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number }[]
  >([]);

  // Generar partículas aleatorias
  useEffect(() => {
    const temp: { x: number; y: number; size: number }[] = [];
    for (let i = 0; i < 40; i++) {
      temp.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
      });
    }
    setParticles(temp);
  }, []);

  // Animación del sobre
  const envelopeSpring = useSpring({
    transform: hover
      ? "translateY(-10px) scale(1.05) rotate(1deg)"
      : "translateY(0px) scale(1) rotate(0deg)",
    boxShadow: hover
      ? "0 25px 60px rgba(0,0,0,0.25)"
      : "0 15px 40px rgba(0,0,0,0.15)",
    config: config.wobbly,
  });

  // Animación para los textos
  const textItems = [
    "Esta invitación es completamente privada.",
    "Solo puedes acceder con el número que te compartieron los novios.",
    "Gracias por acompañarnos en este momento tan especial.",
  ];

  const trail = useTrail(textItems.length, {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: config.gentle,
    delay: 600,
  });

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fdfcfb, #e2e2e2)",
        overflow: "hidden",
        padding: 24,
      }}
    >
      {/* Partículas luminosas */}
      {particles.map((p, idx) => (
        <animated.div
          key={idx}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(255,215,0,0.7)",
            top: `${p.y}%`,
            left: `${p.x}%`,
            animation: `float${idx} ${
              2 + Math.random() * 3
            }s ease-in-out infinite alternate`,
          }}
        />
      ))}

      <animated.div
        style={{
          ...envelopeSpring,
          background: "linear-gradient(145deg, #f5ba61ff, #f0f0f0)",
          padding: 40,
          borderRadius: 24,
          maxWidth: 600,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          cursor: "pointer",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Title
          level={2}
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#222",
            marginBottom: 24,
          }}
        >
          Invitación Privada
        </Title>

        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {trail.map((props, idx) => (
            <animated.div key={idx} style={props}>
              <Paragraph
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  fontFamily: "'Lato', sans-serif",
                  color: "#333",
                }}
              >
                {textItems[idx]}
              </Paragraph>
            </animated.div>
          ))}
        </Space>

        <animated.div
          style={useSpring({
            transform: hover
              ? "rotateX(15deg) translateY(-10px)"
              : "rotateX(0deg) translateY(0px)",
            config: config.stiff,
          })}
        ></animated.div>
      </animated.div>

      {/* Animación CSS para partículas */}
      <style jsx>{`
        ${particles
          .map(
            (_, idx) => `
          @keyframes float${idx} {
            0% { transform: translateY(0px); opacity: 0.7; }
            100% { transform: translateY(-20px); opacity: 0.3; }
          }
        `
          )
          .join("\n")}
      `}</style>
    </div>
  );
}

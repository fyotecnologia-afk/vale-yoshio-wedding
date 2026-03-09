"use client";

import React from "react";
import { Typography } from "antd";
import { useTrail, animated } from "@react-spring/web";
import weddingData from "@/data/weddingData.json";

const { Title, Text } = Typography;

interface ItineraryItem {
  time: string;
  title: string;
  location?: string;
  description?: string;
}

const ItineraryTimeline: React.FC = () => {
  const items: ItineraryItem[] = weddingData.itinerary;

  const trail = useTrail(items.length, {
    from: { opacity: 0, transform: "translate3d(-20px,0,0)" },
    to: { opacity: 1, transform: "translate3d(0,0,0)" },
    config: { mass: 1, tension: 220, friction: 20 },
  });

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <Title
        level={2}
        className="title-decorative"
        style={{
          textAlign: "center",
          margin: "1rem 0 0",
        }}
      >
        Itinerario
      </Title>

      <div style={{ position: "relative", paddingLeft: 30 }}>
        {/* Línea vertical */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 15,
            width: 2,
            height: "100%",
            background: "rgb(206, 167, 150)",
          }}
        />

        {trail.map((style, index) => {
          const item = items[index];
          return (
            <animated.div
              key={index}
              style={{
                ...style,
                position: "relative",
                marginBottom: 40,
                paddingLeft: 20,
              }}
            >
              {/* Punto en la línea */}
              <div
                style={{
                  position: "absolute",
                  left: -2,
                  top: 5,
                  width: 12,
                  height: 12,
                  background: "rgb(206, 167, 150)",
                  borderRadius: "50%",
                  border: "2px solid rgb(237, 210, 203)",
                  boxShadow: "0 0 4px rgba(141, 144, 125,.9)",
                }}
              />

              <Text
                type="secondary"
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  color: "#7a8b75",
                }}
                className="font-manjari"
              >
                {item.time}
              </Text>
              <Title
                level={4}
                style={{
                  margin: "4px 0",
                  fontFamily: "'Meow Script', cursive",
                  fontSize: 24,
                  color: "#7a8b75",
                }}
              >
                {item.title}
              </Title>
              <Text
                className="font-manjari"
                style={{
                  color: "#7a8b75",
                  display: "block",
                }}
              >
                {item.location}
              </Text>
              {item.description && (
                <Text
                  className="font-manjari"
                  style={{
                    color: "#7a8b75",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  {item.description}
                </Text>
              )}
            </animated.div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryTimeline;

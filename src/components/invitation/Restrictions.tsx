"use client";

import React from "react";
import { Typography } from "antd";
import weddingData from "@/data/weddingData.json";

const { Text } = Typography;

const Restrictions: React.FC = () => {
  const restrictions = weddingData.restrictions?.restriction ?? [];

  if (!restrictions.length) return null;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <strong
        className="font-manjari"
        style={{
          display: "block",
          fontSize: "1rem",
          lineHeight: 1.6,
          marginTop: "1rem",
        }}
      >
        SIN NIÑOS
      </strong>

      <Text
        className="font-manjari"
        style={{
          display: "block",
          fontSize: "1rem",
          lineHeight: 1.6,
          marginBottom: "1rem",
        }}
      >
        Adoramos a tus pequeños, sin embargo papá y mamá también necesitan un
        día libre. Por favor no niños.
      </Text>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {restrictions.map((item, index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>
            <Text
              className="font-manjari"
              style={{
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restrictions;

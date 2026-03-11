import React from "react";
import { Typography } from "antd";
import weddingData from "@/data/weddingData.json";

const { Title, Paragraph } = Typography;

const DressCode: React.FC = () => {
  const { dressCode } = weddingData;

  return (
    <div
      style={{
        margin: "0 auto",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Título */}
      <div style={{ marginBottom: 32, position: "relative", zIndex: 10 }}>
        <Title
          level={2}
          style={{
            textAlign: "center",
            margin: "1rem 0 0",
          }}
          className="title-decorative"
        >
          Dress Code
        </Title>
      </div>

      {/* Imagen Dress Code */}
      <img
        src={dressCode.image}
        alt="Dress Code"
        style={{
          maxWidth: "70%",
          marginBottom: 24,
          objectFit: "cover",
          userSelect: "none",
        }}
        draggable={false}
      />

      {/* Descripción */}
      <Paragraph
        style={{
          fontSize: "1rem",
          maxWidth: 700,
          margin: "0 auto",
          color: "#7A8B75",
          userSelect: "text",
        }}
        className="font-manjari"
      >
        {dressCode.restrictions.map((text: string, index: number) => (
          <React.Fragment key={index}>
            {text}
            {index < dressCode.restrictions.length - 1 && <br />}
          </React.Fragment>
        ))}
      </Paragraph>
    </div>
  );
};

export default DressCode;

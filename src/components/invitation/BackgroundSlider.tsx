import React from "react";

const imageUrl = "images/mansory/gallery-1.webp";

const ViewpagerSimple: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <img
        src={imageUrl}
        alt="Gallery"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
};

export default ViewpagerSimple;

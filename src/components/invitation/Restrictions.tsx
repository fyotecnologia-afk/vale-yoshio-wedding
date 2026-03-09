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
        maxWidth: "900px",
        margin: "-20px auto",
        textAlign: "center",
      }}
    >
      <div>
        {restrictions.map((item, index) => (
          <React.Fragment key={index}>
            <Text
              style={{
                fontSize: "clamp(0.7rem, 2vw, 1.2rem)",
                lineHeight: 1.6,
                margin: "1rem 0 0",
              }}
              className="font-manjari"
            >
              {item}
            </Text>

            {index < restrictions.length - 1 && (
              <Text
                style={{
                  fontSize: "clamp(0.7rem, 2vw, 1.2rem)",
                  lineHeight: 1.6,
                  margin: "0px 2px 0px",
                }}
                className="font-manjari"
              >
                |
              </Text>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Restrictions;

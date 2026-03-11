"use client";

import React from "react";
import { Typography } from "antd";
import weddingData from "@/data/weddingData.json";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";
import styles from "@/styles/Itinerary.module.css";

const { Title, Text } = Typography;

interface ItineraryItem {
  time: string;
  title: string;
  location?: string;
  description?: string;
}

const icons = ["/icons/iglesia-icono-2.png", "/icons/icono-brindis-click.png"];

const ItineraryTimeline: React.FC = () => {
  const items: ItineraryItem[] = weddingData.itinerary;

  return (
    <div className={styles.container}>
      <Title
        level={2}
        className="title-decorative"
        style={{ textAlign: "center" }}
      >
        Itinerario
      </Title>

      <VerticalTimeline className={styles.timeline}>
        {items.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            date=""
            contentStyle={{ boxShadow: "none", background: "transparent" }}
            contentArrowStyle={{ display: "none" }}
            icon={
              <div className={styles.iconWrapper}>
                <img src={icons[index]} alt="" />
              </div>
            }
            iconStyle={{ background: "transparent", boxShadow: "none" }}
          >
            <div className={styles.card}>
              <Text className={styles.time}>{item.time}</Text>

              <Title level={4} className={styles.title}>
                {item.title}
              </Title>

              {item.location && (
                <Text className={styles.text}>{item.location}</Text>
              )}

              {item.description && (
                <Text className={styles.text}>{item.description}</Text>
              )}
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default ItineraryTimeline;

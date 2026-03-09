import React from "react";

interface LocationPinIconProps {
  size?: number;
  color?: string;
}

const LocationPinIcon: React.FC<LocationPinIconProps> = ({
  size = 24,
  color = "rgb(206, 167, 150)",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <ellipse cx="12" cy="21" rx="9" ry="3" fill={color} />
    <path
      d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
      fill={color}
      stroke="white" // Color de contorno
      strokeWidth={0.7} // Grosor de contorno
    />
  </svg>
);

export default LocationPinIcon;

import React from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import weddingData from "@/data/weddingData.json";
import LocationPinIcon from "./LocationPin";

const { Title, Text } = Typography;

interface Hotel {
  name: string;
  address: string;
  mapsLink: string;
  image: string;
}

const mapsButtonStyle: React.CSSProperties = {
  backgroundColor: "rgb(206, 167, 150)", // dorado
  color: "#fff",
  border: "none",
  borderRadius: "25px 6px 6px 25px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "0 20px 0 0",
  textTransform: "uppercase",
  fontSize: "10px",
  gap: "8px",
  height: "30px",
};

const mapsIconWrapper: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "50%",
  padding: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgb(206, 167, 150)",
  marginRight: "8px",
  fontSize: "1rem",
};

const HotelSuggestions: React.FC = () => {
  const hotels: Hotel[] = weddingData.hotels;

  return (
    <div>
      <Title
        className="title-decorative"
        level={2}
        style={{
          textAlign: "center",
          margin: "1rem 0 0",
        }}
      >
        Sugerencias de Hospedaje
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {hotels.map((hotel, idx) => (
          <Col
            xs={24}
            sm={12}
            md={8}
            key={idx}
            style={{ display: "flex", padding: "0px 30px 0px" }}
          >
            <Card
              hoverable
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                border: "2px solid rgb(206, 167, 150)",
                borderRadius: 12,
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                // Para que el Card ocupe toda la altura disponible en el Col:
                height: "100%",
              }}
            >
              {/* Header: título con altura fija */}
              <div
                style={{
                  minHeight: 60, // ajusta según necesidad para que nombre alto quede igual
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 10px",
                  overflow: "hidden",
                }}
              >
                <Title
                  level={4}
                  style={{
                    color: "#7a8b75",
                    fontFamily: "'Manjari', sans-serif",
                    fontSize: "1.3rem",
                    margin: 0,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {hotel.name}
                </Title>
              </div>

              {/* Contenido: imagen + dirección */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0 10px",
                  overflow: "hidden",
                }}
              >
                <img
                  alt={hotel.name}
                  src={hotel.image}
                  style={{
                    width: "70%",
                    height: 180,
                    objectFit: "cover",
                    display: "block",
                    marginBottom: 12,
                    borderRadius: 8,
                  }}
                />
                <Text
                  style={{
                    color: "#7a8b75",
                    fontFamily: "'Manjari', sans-serif",
                    textAlign: "center",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    fontSize: "0.9rem",
                  }}
                >
                  <EnvironmentOutlined /> {hotel.address}
                </Text>
              </div>

              {/* Footer: botón al fondo */}
              <div
                style={{
                  marginTop: "auto", // empuja al botón hacia el fondo
                  textAlign: "center",
                  padding: "12px 0 0",
                }}
              >
                <Button
                  href={hotel.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={mapsButtonStyle}
                >
                  <span style={mapsIconWrapper}>
                    <LocationPinIcon size={20} />
                  </span>
                  <span style={{ lineHeight: "1.1", fontSize: ".5rem" }}>
                    VER EN
                    <br />
                    GOOGLE MAPS
                  </span>
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HotelSuggestions;

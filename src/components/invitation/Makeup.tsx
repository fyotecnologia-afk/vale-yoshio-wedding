import React from "react";
import { Card, Button, Row, Col, Typography } from "antd";
import weddingData from "@/data/weddingData.json";

const { Title, Text } = Typography;

interface MakeupArtistSimple {
  avatar: string;
  username: string;
  followers: string;
  name: string;
  phone: string;
  code?: string;
  service: string;
  profileLink: string;
}

const ArtistCardSimple: React.FC<{ artist: MakeupArtistSimple }> = ({
  artist,
}) => {
  return (
    <Card
      style={{
        borderRadius: 10,
        border: "1px solid rgb(206, 167, 150)",
        marginBottom: 16,
        backgroundColor: "#fef9f2",
        padding: "12px 16px",
      }}
      styles={{ body: { padding: 0 } }}
      size="small"
    >
      {/* Primera línea: avatar + username/followers + botón */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        {/* Avatar + Text */}
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <img
            src={artist.avatar}
            alt={artist.username}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgb(206, 167, 150)",
              marginRight: 12,
            }}
          />
          <div>
            <Text strong>{artist.username}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {artist.followers}
            </Text>
          </div>
        </div>

        {/* Button */}
        <Button
          type="primary"
          size="small"
          href={artist.profileLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#3b5998",
            borderColor: "#3b5998",
            marginLeft: 12,
          }}
        >
          Ver perfil
        </Button>
      </div>

      {/* Datos del artista */}
      <div
        style={{
          marginTop: 8,
          fontSize: 14,
          color: "#7a8b75",
          textAlign: "center",
        }}
      >
        <div>
          {artist.name} | {artist.phone}
        </div>
        <div>
          {artist.code && <span>Código: {artist.code} | </span>}
          {artist.service}
        </div>
      </div>
    </Card>
  );
};

const MakeupListSimple: React.FC = () => {
  const artists: MakeupArtistSimple[] = weddingData.makeup;

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
        Maquillaje y peinado
      </Title>
      <Row gutter={[16, 16]}>
        {artists.map((artist, idx) => (
          <Col xs={24} sm={24} md={12} key={idx}>
            <ArtistCardSimple artist={artist} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MakeupListSimple;

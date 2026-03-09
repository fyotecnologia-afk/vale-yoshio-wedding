import React, { useState } from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import weddingData from "@/data/weddingData.json";
import DoubleDownArrowIcon from "./DoubleArrow";
import Liverpool from "./Liverpool";

const { Title, Text } = Typography;

const GiftTable: React.FC = () => {
  const { message, options } = weddingData.giftTable;
  const [copiedText, setCopiedText] = useState<string>("");
  const [visibleDetails, setVisibleDetails] = useState<number | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000);
    } catch {
      alert("No se pudo copiar al portapapeles");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Title
        level={2}
        style={{ textAlign: "center", margin: "1rem 0 0" }}
        className="title-decorative"
      >
        Mesa de Regalos
      </Title>

      <Text
        style={{
          display: "block",
          textAlign: "center",
          color: "#7A8B75",
          fontSize: 16,
          maxWidth: 600,
          margin: "0 auto 40px auto",
          lineHeight: 1.5,
        }}
      >
        {message}
      </Text>

      <Row gutter={[24, 24]} justify="center">
        {options.map((option, index) => {
          const isTransfer = option.type.toLowerCase() === "transferencia";
          const isLiverpool = option.type.toLowerCase() === "amazon";
          const showDetails = !isTransfer || visibleDetails === index;

          return (
            <Col xs={24} sm={12} md={10} key={index}>
              <Card
                style={{
                  borderRadius: 20,
                  border: `1px solid #F6F1EB`,
                  background: "rgba(246, 241, 235, 0.9)",
                  color: "#7A8B75",
                  maxWidth: 320,
                  margin: "0 auto",
                }}
                styles={{ body: { padding: 16 } }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start", // Para que imagen no se mueva al abrir detalles
                  }}
                >
                  {/* Imagen */}
                  <div style={{ flexShrink: 0 }}>
                    {isTransfer ? (
                      <img
                        src="/icons/santander.webp"
                        alt="Santander"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 80,
                          height: 80,
                          border: "2px solid rgb(237, 210, 203)",
                          borderRadius: "12px",
                          backgroundColor: "rgb(237, 210, 203)",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 80,
                          height: 80,

                          borderRadius: "12px",
                        }}
                      >
                        <img
                          src="/images/amazon.webp"
                          alt="Amazon"
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <Title
                      level={5}
                      style={{
                        marginBottom: 8,
                        fontSize: "clamp(1rem, 2vw, 1.2rem)",
                        fontWeight: 100,
                        color: "#7A8B75",
                      }}
                    >
                      {option.type}
                    </Title>

                    {/* Aquí solamente para Liverpool */}
                    {isLiverpool && option.details.numeroEvento && (
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: "clamp(1rem, 2vw, 1.2rem)",
                          color: "#7A8B75",
                          marginBottom: 12,
                        }}
                      >
                        <a
                          href={`https://www.amazon.com.mx/wedding/guest-view/${option.details.numeroEvento}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#7A8B75",
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                        >
                          {option.details.numeroEvento}
                        </a>
                      </div>
                    )}

                    {/* Botón para mostrar/ocultar detalles - sólo para transferencia */}
                    {isTransfer && (
                      <Button
                        type="link"
                        onClick={() =>
                          setVisibleDetails((prev) =>
                            prev === index ? null : index,
                          )
                        }
                        style={{
                          fontWeight: 500,
                          color: "rgb(237, 210, 203)",
                          fontSize: 14,
                          marginBottom: 12,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 0,
                          margin: "0 auto",
                          width: 28,
                          height: 28,
                        }}
                        aria-label={
                          showDetails
                            ? "Ocultar datos bancarios"
                            : "Mostrar datos bancarios"
                        }
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: "1px solid rgb(237, 210, 203)",
                            transition: "transform 0.3s ease",
                            transform: showDetails
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            backgroundColor: "rgb(237, 210, 203)",
                          }}
                        >
                          <DoubleDownArrowIcon />
                        </span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Aquí solamente para Transferencia */}
                <div
                  style={{
                    overflow: "hidden",
                    maxHeight: showDetails ? 300 : 0,
                    transition: "max-height 0.3s ease",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {showDetails && (
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#7A8B75",
                      }}
                    >
                      {Object.entries(option.details)
                        // Excluir numeroEvento para Liverpool para no duplicar
                        .filter(
                          ([key]) =>
                            !(
                              isLiverpool &&
                              key.toLowerCase() === "numeroevento"
                            ),
                        )
                        .map(([key, value]) => {
                          const keyLower = key.toLowerCase();
                          const isCopyable = [
                            "beneficiario",
                            "tarjeta",
                            "cuenta",
                            "clabe",
                          ].some((k) => keyLower.includes(k));

                          return (
                            <li
                              key={key}
                              style={{
                                fontWeight: 600,
                                marginBottom: 6,
                                cursor: isCopyable ? "pointer" : "default",
                                userSelect: isCopyable ? "all" : "none",
                              }}
                              onClick={() => isCopyable && handleCopy(value)}
                              title={
                                isCopyable ? "Click para copiar" : undefined
                              }
                            >
                              <strong
                                style={{
                                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                                  color: "#7A8B75",
                                }}
                              >
                                {`${key.replace(/([A-Z])/g, " $1")}: ${value}`}
                              </strong>
                              {copiedText === value && (
                                <span
                                  style={{
                                    marginLeft: 8,
                                    color: "rgb(237, 210, 203)",
                                    fontSize: 12,
                                  }}
                                >
                                  Copiado!
                                </span>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default GiftTable;

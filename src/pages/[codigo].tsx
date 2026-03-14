// pages/[codigo].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Componentes
import Welcome from "@/components/invitation/Welcome";
import TrailAnimation from "@/components/invitation/TrailAnimation";
import BackgroundSlider from "@/components/invitation/BackgroundSlider";
import Viewpages from "@/components/invitation/Viewpages";
import Formulario from "@/components/invitation/FormularioConfirmacion";
import WeddingEvents from "@/components/invitation/WeddingEvents";
import Spinner from "@/components/invitation/Spinner";
import FamilySection from "@/components/invitation/FamilySection";
import MusicPlayer from "@/components/invitation/MusicPlayer";
import Itinerary from "@/components/invitation/Itinerary";
import Gifts from "@/components/invitation/Gifts";
import DressCode from "@/components/invitation/DressCode";
import Restrictions from "@/components/invitation/Restrictions";
import ImagenFinal from "@/components/invitation/ImagenFinal";
import Separador from "@/components/invitation/Separador";
import Countdown from "@/components/invitation/Countdown";

// Tipado
type DataResponse = {
  exists: boolean;
  estado?: string;
  numIntentos?: number;
};

export default function ConfirmacionPage() {
  const router = useRouter();
  const { codigo } = router.query;
  const [numero, setNumero] = useState<string | null>(null);
  const [numIntentos, setNumIntentos] = useState<number>(0);
  const [data, setData] = useState<DataResponse | null>(null);

  useEffect(() => {
    if (!codigo) return;

    const decoded = atob(codigo as string);
    setNumero(decoded);

    fetch(`/api/invitaciones/${encodeURIComponent(decoded)}`)
      .then((res) => res.json())
      .then((resData: DataResponse) => {
        setData(resData);
        setNumIntentos(resData.numIntentos || 0);
      })
      .catch(() => setData({ exists: false }));
  }, [codigo]);

  if (!data) return <Spinner />;
  if (!data.exists || data.estado !== "ACTIVO")
    return <p>Invitación no válida.</p>;

  return (
    <main style={{ position: "relative", overflow: "hidden" }}>
      <MusicPlayer src="/music/cancion.mp3" />

      <div style={{ position: "relative", padding: "20px 0 0 0" }}>
        <Welcome />
      </div>
      <Countdown />
      <TrailAnimation />

      <div style={{ position: "relative", padding: "0 20px 0px" }}>
        <WeddingEvents />
      </div>

      <div style={{ position: "relative" }}>
        <BackgroundSlider />
      </div>
      {/* <Separador
        src="/icons/flowers.png"
        position="left"
        flipY
        overlap={200}
        width={300}
        offsetX={-180}
        offsetY={-150}
      /> */}

      <Separador
        src="/icons/separadores/laurel.png"
        position="right"
        flipY
        overlap={150}
        width={350}
        offsetX={150}
        offsetY={70}
        rotate={50}
        layer="back"
      />
      <Separador
        src="/icons/separadores/laurel.png"
        position="left"
        overlap={150}
        width={350}
        offsetX={-150}
        offsetY={470}
        rotate={50}
        flipX
        layer="back"
      />
      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <FamilySection />
      </div>

      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <Itinerary />
      </div>

      {/* <Separador
        src="/icons/flowers.png"
        position="right"
        overlap={160}
        width={250}
        offsetX={120}
        offsetY={-16}
      /> */}
      <div style={{ position: "relative" }}>
        <Viewpages />
      </div>
      {/* <Separador
        src="/icons/flowers.png"
        position="left"
        flipY
        overlap={200}
        width={300}
        offsetX={-180}
        offsetY={-150}
      /> */}

      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <DressCode />
      </div>

      <Separador
        src="/icons/separadores/separador.png"
        position="center"
        overlap={0}
        width={150}
        offsetX={0}
        offsetY={0}
      />
      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <Gifts />
      </div>

      <div style={{ position: "relative", padding: "0 20px 0px" }}>
        <Restrictions />
      </div>

      {/* <Separador
        src="/icons/flowers.png"
        position="right"
        overlap={160}
        width={250}
        offsetX={120}
        offsetY={-16}
      /> */}
      <div style={{ position: "relative" }}>
        <ImagenFinal />
      </div>
      {/* <Separador
        src="/icons/flowers.png"
        position="left"
        flipY
        overlap={180}
        width={300}
        offsetX={-180}
        offsetY={-150}
      /> */}

      <Separador
        src="/icons/separadores/laurel-2.webp"
        position="center"
        overlap={860}
        width={600}
        offsetX={40}
        offsetY={0}
        layer="back"
        rotate={5}
        flipY
        flipX
      />

      {/* Formulario solo recibe lo que necesit */}
      <div style={{ position: "relative", zIndex: 2, padding: "0 20px 20px" }}>
        <Formulario numero={numero} intentosRealizados={numIntentos} />
      </div>
    </main>
  );
}

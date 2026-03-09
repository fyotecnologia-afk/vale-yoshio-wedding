// pages/[codigo].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Componentes
import Welcome from "@/components/invitation/Welcome";
import TrailAnimation from "@/components/invitation/TrailAnimation";
import Masonry from "@/components/invitation/Masonry";
import BackgroundSlider from "@/components/invitation/BackgroundSlider";
import Viewpages from "@/components/invitation/Viewpages";
import Formulario from "@/components/invitation/FormularioConfirmacion";
import WeddingEvents from "@/components/invitation/WeddingEvents";
import HotelSuggestions from "@/components/invitation/HotelSuggestions";
import Spinner from "@/components/invitation/Spinner";
import FamilySection from "@/components/invitation/FamilySection";
import MusicPlayer from "@/components/invitation/MusicPlayer";
import Makeup from "@/components/invitation/Makeup";
import RentCars from "@/components/invitation/RentCars";
import Itinerary from "@/components/invitation/Itinerary";
import Gifts from "@/components/invitation/Gifts";
import DressCode from "@/components/invitation/DressCode";
import Restrictions from "@/components/invitation/Restrictions";
import Slider2 from "@/components/invitation/Slider2";
import ImagenFinal from "@/components/invitation/ImagenFinal";

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

      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Welcome />
      </div>

      <TrailAnimation />

      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <WeddingEvents />
      </div>
      <div style={{ position: "relative" }}>
        <BackgroundSlider />
      </div>
      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <FamilySection />
      </div>
      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <Itinerary />
      </div>
      <div style={{ position: "relative" }}>
        <Viewpages />
      </div>
      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <DressCode />
      </div>
      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <Restrictions />
      </div>
      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <Gifts />
      </div>
      <div style={{ position: "relative", padding: "0 20px 20px" }}>
        <ImagenFinal />
      </div>

      {/* Formulario solo recibe lo que necesit */}
      <div style={{ position: "relative", zIndex: 2, padding: "0 20px 20px" }}>
        <Formulario numero={numero} intentosRealizados={numIntentos} />
      </div>
    </main>
  );
}

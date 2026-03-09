import Head from "next/head";

interface MetaHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function MetaHead({
  title = "Vale y Yoshio Wedding",
  description = "Nos elegimos una vez… y hoy con más amor, nos elegimos para siempre",
  image = "https://majo-mau-wedding.vercel.app/preview.jpg",
  url = "https://majo-mau-wedding.vercel.app/",
}: MetaHeadProps) {
  return (
    <Head>
      {/* Title & description */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="es_MX" />
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Favicons */}
      <link rel="icon" href="/fav/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/fav/favicon-96x96.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/fav/apple-touch-icon.png"
      />
      {/* PWA manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      {/* Theme colors */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Head>
  );
}

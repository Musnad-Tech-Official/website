import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Musnad Tech | مسند للتقنية",
    short_name: "Musnad",
    description: "Empowering Next-Generation Digital Experiences | تمكين تجارب رقمية متطورة للجيل القادم",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#c22c22",
    categories: ["business", "productivity", "technology"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/brand/logo-light.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

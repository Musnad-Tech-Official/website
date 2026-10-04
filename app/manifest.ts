import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Musnad Tech",
    short_name: "Musnad",
    description: "Empowering Next-Generation Digital Experiences",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#c22c22",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

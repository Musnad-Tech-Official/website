import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import messages from "@/messages/en.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || messages.SEO.socialTitle;
  const description = searchParams.get("description") || messages.SEO.socialDescription;

  const logo = await readFile(join(process.cwd(), "public/brand/logo-light.png"));
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "80px", background: "#faf9f7", color: "#18181b", borderBottom: "20px solid #c22c22" }}>
      {/* ImageResponse embeds the local brand asset without a network request. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64,${logo.toString("base64")}`} width={420} height={140} alt="Musnad Tech" />
      <div style={{ display: "flex", marginTop: "64px", fontSize: "62px", fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
      <div style={{ display: "flex", marginTop: "24px", fontSize: "28px", color: "#52525b" }}>{description}</div>
    </div>,
    { width: 1200, height: 630 },
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aura — adaptive beauty";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          background:
            "radial-gradient(circle at 25% 20%, #d4a698 0%, transparent 40%), radial-gradient(circle at 80% 0%, #e6c789 0%, transparent 45%), radial-gradient(circle at 50% 100%, #f0d8d8 0%, transparent 55%), #faf6ee",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#3a2a32",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            opacity: 0.65,
          }}
        >
          Aura
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 96,
            color: "#3a2a32",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 900,
            display: "flex",
          }}
        >
          Adaptive beauty,
          <br />
          composed for today.
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "#3a2a32",
            opacity: 0.7,
            maxWidth: 900,
            display: "flex",
          }}
        >
          A daily ritual that listens to your sleep, stress, cycle, and the
          climate outside.
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#3a2a32",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#9b5c4f",
              }}
            />
            aura.demo
          </div>
          <div style={{ opacity: 0.6 }}>Built with Next.js · shadcn/ui</div>
        </div>
      </div>
    ),
    size,
  );
}

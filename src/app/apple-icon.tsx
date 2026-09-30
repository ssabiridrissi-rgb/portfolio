import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "#070606",
          color: "#f6f3f2",
          fontSize: 104,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        S
        <div style={{ width: 22, height: 22, borderRadius: 9999, background: "#ff3d2e", marginTop: 52 }} />
      </div>
    ),
    size,
  );
}

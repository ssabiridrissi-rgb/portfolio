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
          background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 60%, #8b5cf6 100%)",
          color: "white",
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        SSI
      </div>
    ),
    size,
  );
}

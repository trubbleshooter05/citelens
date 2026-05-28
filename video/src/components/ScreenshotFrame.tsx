import { Img, staticFile } from "remotion";
import { colors } from "../tokens";

type Props = {
  img: string;
  accent?: string;
};

export function ScreenshotFrame({ img, accent = colors.borderBright }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 168,
        bottom: 420,
        borderRadius: 24,
        overflow: "hidden",
        border: `2px solid ${accent}`,
        boxShadow: "0 0 40px rgba(79,142,247,0.15), 0 16px 48px rgba(0,0,0,0.65)",
        background: "#0a0c12",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile(img)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "top center",
        }}
      />
    </div>
  );
}

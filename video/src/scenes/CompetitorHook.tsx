import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, font } from "../tokens";

/** Frame ranges from `competitor.mp3` (Whisper tiny) @ 30fps — on-screen copy matches VO. */
const CAPTIONS: { start: number; end: number; text: string }[] = [
  { start: 0, end: 146, text: "Quick reality check. Your brand might not be getting cited by ChatGPT," },
  { start: 146, end: 266, text: "Claude, or Perplexity. Your competitors are." },
  { start: 266, end: 396, text: "CiteLens shows exactly where you're missing and what to fix first." },
  { start: 396, end: 544, text: "This is the part most tools skip, action steps, not vanity charts." },
  { start: 544, end: 633, text: "If you want early access, join the list." },
];

function captionAt(frame: number) {
  return CAPTIONS.find((c) => frame >= c.start && frame < c.end) ?? null;
}

export function CompetitorHook() {
  const frame = useCurrentFrame();
  const cap = captionAt(frame);
  const segStart = cap?.start ?? 0;
  const fade = interpolate(frame - segStart, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Audio src={staticFile("audio/competitor.mp3")} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(79,142,247,0.1) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: "42%",
          transform: "translateY(-50%)",
          opacity: cap ? fade : 0,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 52,
            fontWeight: font.black,
            lineHeight: 1.35,
            color: colors.white,
            textAlign: "center",
          }}
        >
          {cap?.text}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 100,
          textAlign: "center",
          fontSize: 30,
          fontWeight: font.bold,
          color: colors.accentBright,
          letterSpacing: 2,
        }}
      >
        CITELENS · citelens.app
      </div>
    </AbsoluteFill>
  );
}

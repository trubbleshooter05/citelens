import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, font } from "../tokens";

/** Frame ranges from `Validation Hook.mp3` (Whisper tiny) @ 30fps — on-screen copy matches VO. */
const CAPTIONS: { start: number; end: number; text: string }[] = [
  { start: 0, end: 112, text: "This is an MVP, not a finished platform." },
  { start: 112, end: 168, text: "I'm testing one thing." },
  { start: 168, end: 249, text: "Do founders and SMB marketers want" },
  { start: 249, end: 350, text: "exact weekly AI citation actions?" },
  { start: 350, end: 432, text: "Not another analytics dashboard." },
  { start: 432, end: 528, text: "If yes, I'll build live audits next." },
  { start: 528, end: 597, text: "If not, I kill it." },
  { start: 597, end: 697, text: "Try the demo and tell me if this solves a real pain." },
];

function captionAt(frame: number) {
  return CAPTIONS.find((c) => frame >= c.start && frame < c.end) ?? null;
}

export function ScoreReveal() {
  const frame = useCurrentFrame();
  const cap = captionAt(frame);
  const segStart = cap?.start ?? 0;
  const fade = interpolate(frame - segStart, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 55%, rgba(255,77,77,0.08) 0%, ${colors.bg} 58%)`,
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Audio src={staticFile("audio/Validation Hook.mp3")} />

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
            fontSize: cap && cap.start === 249 ? 56 : 50,
            fontWeight: font.black,
            lineHeight: 1.35,
            color: cap?.start === 249 ? colors.accentBright : colors.white,
            textAlign: "center",
            textShadow:
              cap?.start === 249 ? `0 0 36px rgba(79,142,247,0.45)` : undefined,
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
          fontSize: 28,
          fontWeight: font.bold,
          color: colors.muted,
          letterSpacing: 2,
        }}
      >
        CITELENS · citelens.app
      </div>
    </AbsoluteFill>
  );
}

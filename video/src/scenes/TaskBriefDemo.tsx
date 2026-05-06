import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, font } from "../tokens";

/** Frame ranges from `task Brief.mp3` (Whisper tiny) @ 30fps — on-screen copy matches VO. */
const CAPTIONS: { start: number; end: number; text: string }[] = [
  {
    start: 0,
    end: 165,
    text: "This is why I built CiteLens. Most GEO tools tell you your visibility score.",
  },
  {
    start: 165,
    end: 321,
    text: "Cool, but then what? Here, you get a copy-ready weekly task brief.",
  },
  {
    start: 321,
    end: 508,
    text: "Like: add a comparison table on this page, include this schema, add this proof stat.",
  },
  {
    start: 508,
    end: 703,
    text: "So your writer or SEO can execute immediately. That's the product, less guessing, more shipping.",
  },
];

function captionAt(frame: number) {
  return CAPTIONS.find((c) => frame >= c.start && frame < c.end) ?? null;
}

export function TaskBriefDemo() {
  const frame = useCurrentFrame();
  const cap = captionAt(frame);
  const segStart = cap?.start ?? 0;
  const fade = interpolate(frame - segStart, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 0%, rgba(79,142,247,0.12) 0%, ${colors.bg} 55%)`,
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Audio src={staticFile("audio/task Brief.mp3")} />

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
            fontSize: 50,
            fontWeight: font.black,
            lineHeight: 1.38,
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
          fontSize: 28,
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

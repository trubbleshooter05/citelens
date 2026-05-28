import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { ScreenshotFrame } from "../components/ScreenshotFrame";
import { colors, font } from "../tokens";

// Caption-only UGC — no voiceover. Duration synced to scene list below.
const SCENES = [
  { from: 0, dur: 90, caption: "Quick reality check.", emphasis: "reality check", layout: "hook", img: "", bug: "stop scrolling", bg: "#0D0F1A" },
  { from: 90, dur: 120, caption: "Your brand might not be cited by ChatGPT or Perplexity.", emphasis: "not", layout: "screenshot", img: "screenshots/01-hero.png", bug: "AI is skipping you", bg: "#080B14" },
  { from: 210, dur: 120, caption: "Your competitors are.", emphasis: "competitors", layout: "screenshot", img: "screenshots/04-diagnosis.png", bug: "who AI cites instead", bg: "#0D0F1A" },
  { from: 330, dur: 130, caption: "CiteLens shows exactly where you're missing and what to fix.", emphasis: "what to fix", layout: "screenshot", img: "screenshots/03-action-report.png", bug: "not just a score", bg: "#080B14" },
  { from: 460, dur: 110, caption: "Action steps. Not vanity charts.", emphasis: "Action steps", layout: "screenshot", img: "screenshots/05-actions.png", bug: "weekly fix list", bg: "#0A0E1A" },
  { from: 570, dur: 120, caption: "Early access → citelens.app", emphasis: "citelens.app", layout: "cta", img: "", bug: "early access", bg: "#060810" },
] as const;

export const CITELENS_UGC_DURATION = SCENES.reduce((sum, s) => sum + s.dur, 0);

const Bug = ({ text }: { text: string }) => (
  <div
    style={{
      position: "absolute",
      top: 72,
      left: 48,
      right: 48,
      display: "flex",
      justifyContent: "space-between",
      fontSize: 26,
      fontWeight: font.black,
      color: colors.white,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      zIndex: 30,
    }}
  >
    <span>{text}</span>
    <span style={{ color: colors.red }}>● REC</span>
  </div>
);

const Cap = ({ text, emphasis, accent = colors.accentBright }: { text: string; emphasis?: string; accent?: string }) => {
  const fs = text.length > 60 ? 40 : text.length > 40 ? 46 : 52;
  const renderText = () => {
    if (!emphasis || !text.includes(emphasis)) return <>{text}</>;
    const [a, b] = text.split(emphasis);
    return (
      <>
        {a}
        <span style={{ color: accent }}>{emphasis}</span>
        {b}
      </>
    );
  };
  return (
    <div
      style={{
        position: "absolute",
        bottom: 200,
        left: 48,
        right: 48,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
        borderRadius: 20,
        padding: "28px 32px",
        textAlign: "center",
        fontSize: fs,
        fontWeight: font.black,
        lineHeight: 1.3,
        color: colors.white,
        zIndex: 20,
      }}
    >
      {renderText()}
    </div>
  );
};

const Brand = ({ color = colors.accentBright }: { color?: string }) => (
  <div
    style={{
      position: "absolute",
      bottom: 88,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 26,
      fontWeight: font.bold,
      color,
      letterSpacing: 4,
      textTransform: "uppercase",
      zIndex: 20,
    }}
  >
    citelens.app
  </div>
);

const HookSlide = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        fontSize: 80,
        fontWeight: font.black,
        color: colors.white,
        textAlign: "center",
        lineHeight: 1.2,
        padding: "0 64px",
      }}
    >
      AI is{"\n"}
      <span style={{ color: colors.red }}>skipping</span>
      {"\n"}your brand.
    </div>
  </div>
);

const CtaSlide = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: op,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 56,
        padding: "0 64px",
      }}
    >
      <div style={{ fontSize: 66, fontWeight: font.black, color: colors.white, textAlign: "center", lineHeight: 1.2 }}>
        See who AI cites{"\n"}instead of you.
      </div>
      <div
        style={{
          padding: "30px 64px",
          borderRadius: 999,
          background: colors.accent,
          fontSize: 46,
          fontWeight: font.black,
          color: colors.white,
        }}
      >
        citelens.app
      </div>
    </div>
  );
};

export function CiteLensUgcDaily() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      {SCENES.map((s) => (
        <Sequence key={s.from} from={s.from} durationInFrames={s.dur}>
          <AbsoluteFill style={{ background: s.bg }}>
            <Bug text={s.bug} />
            {s.layout === "hook" && <HookSlide />}
            {s.layout === "screenshot" && <ScreenshotFrame img={s.img} />}
            {s.layout === "cta" && <CtaSlide frame={frame - s.from} />}
            {s.layout !== "cta" && <Cap text={s.caption} emphasis={s.emphasis} />}
            <Brand />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

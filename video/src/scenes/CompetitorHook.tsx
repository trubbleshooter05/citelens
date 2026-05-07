import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors, font } from "../tokens";

// Synced to competitor.mp3 @ 30fps (~21s = 633 frames)
const SCENES = [
  { from: 0,   dur: 96,  caption: "Quick reality check.",                                                        emphasis: "reality check", layout: "hook",       img: "",                              bug: "stop scrolling",    bg: "#0D0F1A" },
  { from: 96,  dur: 110, caption: "Your brand might not be cited by ChatGPT or Perplexity.",                     emphasis: "not",           layout: "screenshot", img: "screenshots/01-hero.png",        bug: "AI is skipping you", bg: "#080B14" },
  { from: 206, dur: 110, caption: "Your competitors are.",                                                        emphasis: "competitors",   layout: "screenshot", img: "screenshots/04-diagnosis.png",  bug: "who AI cites instead", bg: "#0D0F1A" },
  { from: 316, dur: 130, caption: "CiteLens shows exactly where you're missing and what to fix.",                emphasis: "what to fix",   layout: "screenshot", img: "screenshots/03-action-report.png", bug: "not just a score", bg: "#080B14" },
  { from: 446, dur: 98,  caption: "Action steps. Not vanity charts.",                                            emphasis: "Action steps",  layout: "screenshot", img: "screenshots/05-actions.png",    bug: "weekly fix list",   bg: "#0A0E1A" },
  { from: 544, dur: 89,  caption: "Early access → citelens.app",                                                emphasis: "citelens.app",  layout: "cta",        img: "",                              bug: "early access",      bg: "#060810" },
] as const;

/* ─── shared components ─── */

const Bug = ({ text }: { text: string }) => (
  <div style={{
    position: "absolute", top: 72, left: 72, right: 72,
    display: "flex", justifyContent: "space-between",
    fontSize: 26, fontWeight: font.black, color: colors.white,
    textTransform: "uppercase", letterSpacing: 1.5, zIndex: 30,
  }}>
    <span>{text}</span>
    <span style={{ color: colors.red }}>● REC</span>
  </div>
);

/** Semi-transparent pill caption — never clips, always readable */
const Cap = ({ text, emphasis, accent = colors.accentBright }: { text: string; emphasis?: string; accent?: string }) => {
  const fs = text.length > 60 ? 40 : text.length > 40 ? 46 : 52;
  const renderText = () => {
    if (!emphasis || !text.includes(emphasis)) return <>{text}</>;
    const [a, b] = text.split(emphasis);
    return <>{a}<span style={{ color: accent }}>{emphasis}</span>{b}</>;
  };
  return (
    <div style={{
      position: "absolute", bottom: 220, left: 72, right: 72,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
      borderRadius: 20, padding: "28px 32px",
      textAlign: "center", fontSize: fs, fontWeight: font.black,
      lineHeight: 1.3, color: colors.white,
    }}>
      {renderText()}
    </div>
  );
};

const Brand = ({ color = colors.accentBright }: { color?: string }) => (
  <div style={{
    position: "absolute", bottom: 96, left: 0, right: 0,
    textAlign: "center", fontSize: 26, fontWeight: font.bold,
    color, letterSpacing: 4, textTransform: "uppercase",
  }}>
    citelens.app
  </div>
);

/* ─── layout components ─── */

const HookSlide = ({ frame }: { frame: number }) => {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        fontSize: 80, fontWeight: font.black, color: colors.white,
        textAlign: "center", lineHeight: 1.2,
        padding: "0 80px",
      }}>
        AI is{"\n"}<span style={{ color: colors.red }}>skipping</span>{"\n"}your brand.
      </div>
    </div>
  );
};

const Screenshot = ({ img, frame, accent = colors.borderBright }: { img: string; frame: number; accent?: string }) => {
  return (
    <div style={{
      position: "absolute", left: 60, right: 60, top: 200, bottom: 340,
      borderRadius: 28, overflow: "hidden",
      border: `2px solid ${accent}`,
      boxShadow: `0 0 50px rgba(79,142,247,0.2), 0 20px 60px rgba(0,0,0,0.7)`,
    }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      {/* gradient fade at bottom so caption reads over screenshot */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 180,
        background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
      }} />
    </div>
  );
};

const CtaSlide = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", inset: 0, opacity: op,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 56, padding: "0 80px",
    }}>
      <div style={{ fontSize: 66, fontWeight: font.black, color: colors.white, textAlign: "center", lineHeight: 1.2 }}>
        See who AI cites{"\n"}instead of you.
      </div>
      <div style={{
        padding: "30px 64px", borderRadius: 999,
        background: colors.accent,
        fontSize: 46, fontWeight: font.black, color: colors.white,
      }}>
        citelens.app
      </div>
    </div>
  );
};

/* ─── main ─── */

export function CompetitorHook() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: colors.bg, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", overflow: "hidden" }}>
      <Audio src={staticFile("audio/competitor.mp3")} />
      {SCENES.map((s) => (
        <Sequence key={s.from} from={s.from} durationInFrames={s.dur}>
          <AbsoluteFill style={{ background: s.bg }}>
            <Bug text={s.bug} />
            {s.layout === "hook"       && <HookSlide frame={frame - s.from} />}
            {s.layout === "screenshot" && <Screenshot img={s.img} frame={frame - s.from} />}
            {s.layout === "cta"        && <CtaSlide frame={frame - s.from} />}
            {s.layout !== "cta"        && <Cap text={s.caption} emphasis={s.emphasis} />}
            <Brand />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

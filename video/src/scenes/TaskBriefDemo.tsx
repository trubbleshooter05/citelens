import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors, font } from "../tokens";

const SCENES = [
  { from: 0,   dur: 110, caption: "Most GEO tools tell you your visibility score.",             emphasis: "visibility score", layout: "hook",       img: "",                                bug: "not another dashboard", bg: "#0D0F1A" },
  { from: 110, dur: 104, caption: "Cool. But then what?",                                       emphasis: "then what",        layout: "screenshot", img: "screenshots/01-hero.png",          bug: "missing the point",    bg: "#080B14" },
  { from: 214, dur: 110, caption: "CiteLens gives you a copy-ready weekly task brief.",         emphasis: "task brief",       layout: "screenshot", img: "screenshots/03-action-report.png", bug: "actual fix list",      bg: "#0A0E1A" },
  { from: 324, dur: 184, caption: "Add a comparison table. Include this schema. Add proof stats.", emphasis: "this schema",  layout: "screenshot", img: "screenshots/05-actions.png",       bug: "exact instructions",   bg: "#080B14" },
  { from: 508, dur: 195, caption: "Your writer executes immediately. Less guessing, more shipping.", emphasis: "immediately", layout: "screenshot", img: "screenshots/04-diagnosis.png",    bug: "ship this week",       bg: "#0D0F1A" },
] as const;

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

const Cap = ({ text, emphasis }: { text: string; emphasis?: string }) => {
  const fs = text.length > 60 ? 40 : text.length > 40 ? 46 : 52;
  const renderText = () => {
    if (!emphasis || !text.includes(emphasis)) return <>{text}</>;
    const [a, b] = text.split(emphasis);
    return <>{a}<span style={{ color: colors.green }}>{emphasis}</span>{b}</>;
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

const Brand = () => (
  <div style={{
    position: "absolute", bottom: 96, left: 0, right: 0,
    textAlign: "center", fontSize: 26, fontWeight: font.bold,
    color: colors.green, letterSpacing: 4, textTransform: "uppercase",
  }}>
    citelens.app
  </div>
);

const HookSlide = ({ frame }: { frame: number }) => {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 40,
      padding: "0 80px",
    }}>
      <div style={{ fontSize: 76, fontWeight: font.black, color: colors.white, textAlign: "center", lineHeight: 1.2 }}>
        GEO tools give{"\n"}you a score.
      </div>
      <div style={{ fontSize: 60, fontWeight: font.bold, color: colors.muted, textAlign: "center" }}>
        So what?
      </div>
      <div style={{ width: 100, height: 5, borderRadius: 999, background: colors.green }} />
    </div>
  );
};

const Screenshot = ({ img, frame }: { img: string; frame: number }) => {
  return (
    <div style={{
      position: "absolute", left: 60, right: 60, top: 200, bottom: 340,
      borderRadius: 28, overflow: "hidden",
      border: "2px solid rgba(34,197,94,0.45)",
      boxShadow: "0 0 50px rgba(34,197,94,0.18), 0 20px 60px rgba(0,0,0,0.7)",
    }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 160,
        background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
      }} />
    </div>
  );
};

export function TaskBriefDemo() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: colors.bg, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", overflow: "hidden" }}>
      <Audio src={staticFile("audio/task Brief.mp3")} />
      {SCENES.map((s) => (
        <Sequence key={s.from} from={s.from} durationInFrames={s.dur}>
          <AbsoluteFill style={{ background: s.bg }}>
            <Bug text={s.bug} />
            {s.layout === "hook"       && <HookSlide frame={frame - s.from} />}
            {s.layout === "screenshot" && <Screenshot img={s.img} frame={frame - s.from} />}
            <Cap text={s.caption} emphasis={s.emphasis} />
            <Brand />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

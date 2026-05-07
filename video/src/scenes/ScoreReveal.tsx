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

const SCENES = [
  { from: 0,   dur: 112, caption: "This is an MVP. Not a finished platform.",                        emphasis: "MVP",           layout: "hook",       img: "",                                bug: "founder talking",  bg: "#100A0A" },
  { from: 112, dur: 56,  caption: "I'm testing one thing.",                                          emphasis: "one thing",     layout: "hook2",      img: "",                                bug: "honest check",     bg: "#0D0F1A" },
  { from: 168, dur: 182, caption: "Do founders want exact weekly AI citation actions?",              emphasis: "exact weekly",  layout: "screenshot", img: "screenshots/05-actions.png",       bug: "the question",     bg: "#080B14" },
  { from: 350, dur: 82,  caption: "Not another analytics dashboard.",                                emphasis: "Not",           layout: "screenshot", img: "screenshots/03-action-report.png", bug: "action first",     bg: "#0A0E1A" },
  { from: 432, dur: 96,  caption: "If yes, I build live audits next.",                               emphasis: "yes",           layout: "screenshot", img: "screenshots/04-diagnosis.png",    bug: "build or kill",    bg: "#080B14" },
  { from: 528, dur: 69,  caption: "If not, I kill it.",                                              emphasis: "kill it",       layout: "verdict",    img: "",                                bug: "honest founder",   bg: "#100A0A" },
  { from: 597, dur: 100, caption: "Try the demo. Tell me if this solves a real pain.",               emphasis: "real pain",     layout: "cta",        img: "",                                bug: "need your take",   bg: "#060810" },
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
    return <>{a}<span style={{ color: colors.orange }}>{emphasis}</span>{b}</>;
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
    color: colors.orange, letterSpacing: 4, textTransform: "uppercase",
  }}>
    citelens.app
  </div>
);

const HookSlide = ({ frame }: { frame: number }) => {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 80px",
    }}>
      <div style={{ fontSize: 76, fontWeight: font.black, color: colors.white, textAlign: "center", lineHeight: 1.2 }}>
        I'm testing{"\n"}<span style={{ color: colors.orange }}>one thing.</span>
      </div>
    </div>
  );
};

const Hook2Slide = () => (
  <div style={{
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "0 80px",
  }}>
    <div style={{ fontSize: 62, fontWeight: font.black, color: colors.muted, textAlign: "center", lineHeight: 1.25 }}>
      Do SMB marketers{"\n"}want <span style={{ color: colors.white }}>weekly{"\n"}AI fix lists</span>?
    </div>
  </div>
);

const Screenshot = ({ img, frame }: { img: string; frame: number }) => {
  return (
    <div style={{
      position: "absolute", left: 60, right: 60, top: 200, bottom: 340,
      borderRadius: 28, overflow: "hidden",
      border: "2px solid rgba(245,158,11,0.45)",
      boxShadow: "0 0 50px rgba(245,158,11,0.18), 0 20px 60px rgba(0,0,0,0.7)",
    }}>
      <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 160,
        background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
      }} />
    </div>
  );
};

const VerdictSlide = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", inset: 0, opacity: op,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 80px",
    }}>
      <div style={{ fontSize: 100, fontWeight: font.black, color: colors.red, textAlign: "center", lineHeight: 1.1 }}>
        Build.{"\n"}Or{"\n"}Kill.
      </div>
    </div>
  );
};

const CtaSlide = ({ frame }: { frame: number }) => {
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", inset: 0, opacity: op,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 52, padding: "0 80px",
    }}>
      <div style={{ fontSize: 60, fontWeight: font.black, color: colors.white, textAlign: "center", lineHeight: 1.25 }}>
        Try the demo.{"\n"}Tell me if this{"\n"}solves a real pain.
      </div>
      <div style={{
        padding: "28px 60px", borderRadius: 999,
        background: colors.orange,
        fontSize: 44, fontWeight: font.black, color: "#000",
      }}>
        citelens.app
      </div>
    </div>
  );
};

export function ScoreReveal() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: colors.bg, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", overflow: "hidden" }}>
      <Audio src={staticFile("audio/Validation Hook.mp3")} />
      {SCENES.map((s) => (
        <Sequence key={s.from} from={s.from} durationInFrames={s.dur}>
          <AbsoluteFill style={{ background: s.bg }}>
            <Bug text={s.bug} />
            {s.layout === "hook"       && <HookSlide frame={frame - s.from} />}
            {s.layout === "hook2"      && <Hook2Slide />}
            {s.layout === "screenshot" && <Screenshot img={s.img} frame={frame - s.from} />}
            {s.layout === "verdict"    && <VerdictSlide frame={frame - s.from} />}
            {s.layout === "cta"        && <CtaSlide frame={frame - s.from} />}
            {s.layout !== "cta" && s.layout !== "verdict" && <Cap text={s.caption} emphasis={s.emphasis} />}
            <Brand />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, font } from "../tokens";

// 703 frames = 23.4s
// Beat map (VO-driven):
//  0-90   hook words appear
//  90-200 brief card slides in + header
//  200-380 evidence block + tasks appear one by one
//  380-550 second task set / emphasis beats
//  550-650 copy button pulses
//  650-703 hold on CTA

const BRIEF = {
  title: "Create a competitor comparison page",
  effort: "2 hrs",
  impact: "High",
  evidence:
    "Perplexity cites PSA and TAG because they answer pricing, turnaround, and trust signals in one scannable page. Your site has none of this.",
  tasks: [
    "Add pricing table: PSA / TAG / BGS side-by-side",
    "Include turnaround time per tier",
    "Add guarantee + return policy per grader",
    "Drop in 3rd-party trust badges (eBay sold comps)",
    "Publish at /alternatives/psa-vs-tag",
  ],
};

// Second block of context that fades in later
const CONTEXT = [
  { label: "Prompt you're losing", value: "\"PSA vs TAG vs BGS card grading\"", color: colors.red },
  { label: "AI tools citing others", value: "ChatGPT · Perplexity · Gemini", color: colors.orange },
  { label: "Expected traffic gain", value: "+340 visits/mo once cited", color: colors.green },
];

function HookLine({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const words = [
    { text: "Your", highlight: false },
    { text: "competitors", highlight: true },
    { text: "get", highlight: false },
    { text: "cited.", highlight: false },
    { text: "You", highlight: false },
    { text: "don't.", highlight: false },
    { text: "Here's", highlight: false },
    { text: "the", highlight: false },
    { text: "exact", highlight: true },
    { text: "fix.", highlight: false },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 60,
        right: 60,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: font.black,
          lineHeight: 1.1,
          color: colors.white,
        }}
      >
        {words.map((word, i) => {
          const wordFrame = i * 8;
          const prog = spring({
            fps,
            frame: frame - wordFrame,
            config: { damping: 18, stiffness: 180, mass: 0.7 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 14,
                opacity: interpolate(prog, [0, 1], [0, 1], {
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${interpolate(prog, [0, 1], [30, 0])}px) scale(${interpolate(prog, [0, 1], [0.85, 1])})`,
                color: word.highlight ? colors.accentBright : colors.white,
                textShadow: word.highlight
                  ? `0 0 40px ${colors.accent}`
                  : "none",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function BriefCard({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const startFrame = 110;
  const cardProg = spring({
    fps,
    frame: frame - startFrame,
    config: { damping: 18, stiffness: 120, mass: 0.9 },
  });

  if (frame < startFrame - 5) return null;

  const opacity = interpolate(frame - startFrame, [-5, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 320,
        left: 50,
        right: 50,
        opacity,
        transform: `translateY(${interpolate(cardProg, [0, 1], [70, 0])}px)`,
      }}
    >
      <div
        style={{
          background: "rgba(15,22,35,0.98)",
          border: `1.5px solid ${colors.borderBright}`,
          borderRadius: 28,
          padding: "40px 44px",
          boxShadow:
            "0 0 80px rgba(79,142,247,0.12), 0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: font.bold,
                color: colors.accent,
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              ✦ CITELENS TASK BRIEF
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: font.black,
                color: colors.white,
                lineHeight: 1.2,
              }}
            >
              {BRIEF.title}
            </div>
          </div>
          <div
            style={{ textAlign: "right", flexShrink: 0, marginLeft: 20 }}
          >
            <div
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1.5px solid rgba(34,197,94,0.4)",
                borderRadius: 12,
                padding: "8px 20px",
                fontSize: 24,
                fontWeight: font.bold,
                color: colors.green,
                marginBottom: 8,
              }}
            >
              {BRIEF.impact} Impact
            </div>
            <div style={{ fontSize: 22, color: colors.muted }}>
              {BRIEF.effort}
            </div>
          </div>
        </div>

        {/* Evidence block */}
        {frame >= 190 && (
          <div
            style={{
              background: "rgba(255,77,77,0.08)",
              border: "1.5px solid rgba(255,77,77,0.25)",
              borderRadius: 16,
              padding: "22px 28px",
              marginBottom: 28,
              fontSize: 28,
              color: "rgba(255,180,180,0.9)",
              lineHeight: 1.5,
              fontWeight: font.medium,
              opacity: interpolate(frame - 190, [0, 14], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            🔴 {BRIEF.evidence}
          </div>
        )}

        {/* Task list */}
        <div>
          <div
            style={{
              fontSize: 26,
              fontWeight: font.bold,
              color: colors.muted,
              marginBottom: 16,
              letterSpacing: 1,
            }}
          >
            DO THIS WEEK
          </div>
          {BRIEF.tasks.map((task, i) => {
            const taskFrame = 230 + i * 40;
            const taskProg = spring({
              fps,
              frame: frame - taskFrame,
              config: { damping: 18, stiffness: 200 },
            });
            const taskOpacity = interpolate(
              frame - taskFrame,
              [0, 10],
              [0, 1],
              { extrapolateRight: "clamp" }
            );
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 18,
                  marginBottom: 18,
                  opacity: taskOpacity,
                  transform: `translateX(${interpolate(taskProg, [0, 1], [-24, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    background: colors.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: font.black,
                    color: "#fff",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    color: colors.white,
                    lineHeight: 1.4,
                    fontWeight: font.medium,
                  }}
                >
                  {task}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContextRow({ frame }: { frame: number }) {
  const startFrame = 470;
  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 320,
        left: 50,
        right: 50,
        opacity: interpolate(frame - startFrame, [0, 20], [0, 1], {
          extrapolateRight: "clamp",
        }),
      }}
    >
      {/* Overlay gradient to fade card above */}
      <div style={{
        position: "absolute",
        top: -80,
        left: 0,
        right: 0,
        height: 80,
        background: `linear-gradient(to bottom, transparent, ${colors.bg})`,
        pointerEvents: "none",
      }} />
    </div>
  );
}

function CopyButton({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const startFrame = 560;
  const prog = spring({
    fps,
    frame: frame - startFrame,
    config: { damping: 14, stiffness: 220, mass: 0.6 },
  });
  const pulse = Math.sin((frame - startFrame) * 0.15) * 0.025 + 1;
  const copied = frame > startFrame + 60;

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 60,
        right: 60,
        opacity: interpolate(frame - startFrame, [0, 12], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `scale(${interpolate(prog, [0, 1], [0.7, 1]) * pulse}) translateY(${interpolate(prog, [0, 1], [50, 0])}px)`,
      }}
    >
      <div
        style={{
          background: copied
            ? "linear-gradient(135deg, #22C55E, #16A34A)"
            : "linear-gradient(135deg, #4F8EF7, #2563EB)",
          borderRadius: 24,
          padding: "38px 0",
          textAlign: "center",
          boxShadow: copied
            ? "0 0 70px rgba(34,197,94,0.55)"
            : "0 0 70px rgba(79,142,247,0.55)",
          fontSize: 40,
          fontWeight: font.black,
          color: "#fff",
        }}
      >
        {copied
          ? "✓ Brief ready — Comment AUDIT to get yours"
          : "💬 Comment AUDIT below"}
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 26,
          color: colors.muted,
        }}
      >
        I'll send you a real report · citelens.app
      </div>
    </div>
  );
}

export function TaskBriefDemo() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 0%, rgba(79,142,247,0.12) 0%, ${colors.bg} 55%)`,
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Audio src={staticFile("audio/task Brief.mp3")} />

      <HookLine frame={frame} />
      <BriefCard frame={frame} />
      <ContextRow frame={frame} />
      <CopyButton frame={frame} />
    </AbsoluteFill>
  );
}

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

// Spread chat beats across 21s (633 frames)
// VO roughly: intro → chat loads → competitor names → shock → CTA
const CHAT_LINES = [
  {
    role: "user",
    text: "What's the best card grading service for modern cards?",
    frame: 60,
  },
  {
    role: "ai",
    text: "Based on current reviews, **PSA** and **TAG** are the top choices for modern cards. PSA offers the best resale premium while TAG has faster turnaround times.",
    frame: 180,
  },
  {
    role: "ai",
    text: "**BGS** (Beckett) is also widely recommended for vintage and high-end submissions.",
    frame: 330,
  },
];

const COMPETITOR_NAMES = ["PSA", "TAG", "BGS"];

function ChatBubble({
  role,
  text,
  entryFrame,
  currentFrame,
}: {
  role: "user" | "ai";
  text: string;
  entryFrame: number;
  currentFrame: number;
}) {
  const { fps } = useVideoConfig();
  const progress = spring({
    fps,
    frame: currentFrame - entryFrame,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
  });
  const isUser = role === "user";
  const opacity = interpolate(currentFrame - entryFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${interpolate(progress, [0, 1], [28, 0])}px)`,
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 22,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: "linear-gradient(135deg, #4F8EF7 0%, #7B5CF6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            marginRight: 16,
            flexShrink: 0,
            boxShadow: "0 0 28px rgba(79,142,247,0.5)",
          }}
        >
          ✦
        </div>
      )}
      <div
        style={{
          maxWidth: "78%",
          background: isUser
            ? "linear-gradient(135deg, #1D3461 0%, #1A2A4A 100%)"
            : "rgba(255,255,255,0.06)",
          border: isUser
            ? "1.5px solid rgba(79,142,247,0.35)"
            : "1.5px solid rgba(255,255,255,0.1)",
          borderRadius: isUser ? "22px 22px 6px 22px" : "6px 22px 22px 22px",
          padding: "22px 30px",
          fontSize: 34,
          lineHeight: 1.5,
          color: colors.white,
          fontWeight: font.medium,
        }}
      >
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            const word = part.slice(2, -2);
            const isCompetitor = COMPETITOR_NAMES.includes(word);
            return (
              <span
                key={i}
                style={{
                  fontWeight: font.black,
                  color: isCompetitor ? colors.red : colors.white,
                  textShadow: isCompetitor ? `0 0 20px ${colors.red}` : "none",
                  background: isCompetitor
                    ? "rgba(255,77,77,0.15)"
                    : "transparent",
                  borderRadius: 6,
                  padding: isCompetitor ? "2px 8px" : "0",
                }}
              >
                {word}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    </div>
  );
}

// Typing indicator that shows between user question and AI reply
function TypingDots({ frame, showAt, hideAt }: { frame: number; showAt: number; hideAt: number }) {
  if (frame < showAt || frame >= hideAt) return null;
  const pulse = Math.sin((frame - showAt) * 0.3) * 0.4 + 0.6;
  const opacity = interpolate(frame - showAt, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 22, opacity }}>
      <div style={{
        width: 56, height: 56, borderRadius: 28,
        background: "linear-gradient(135deg, #4F8EF7, #7B5CF6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, marginRight: 16,
      }}>✦</div>
      <div style={{
        background: "rgba(255,255,255,0.06)",
        border: "1.5px solid rgba(255,255,255,0.1)",
        borderRadius: "6px 22px 22px 22px",
        padding: "22px 36px",
        display: "flex", gap: 10, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: 6,
            background: colors.muted,
            opacity: Math.sin((frame - showAt) * 0.3 + i * 1.2) * 0.4 + 0.6,
          }} />
        ))}
      </div>
    </div>
  );
}

function TopTag({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const prog = spring({ fps, frame, config: { damping: 20, stiffness: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${interpolate(prog, [0, 1], [-60, 0])}px)`,
        opacity: interpolate(prog, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      <div
        style={{
          background: "rgba(79,142,247,0.15)",
          border: "1.5px solid rgba(79,142,247,0.5)",
          borderRadius: 100,
          padding: "14px 36px",
          fontSize: 28,
          fontWeight: font.bold,
          color: colors.accentBright,
          letterSpacing: 1.5,
        }}
      >
        AI IS RECOMMENDING YOUR COMPETITORS
      </div>
    </div>
  );
}

// Alert badge drops in at frame 450 (~15s)
function AlertBadge({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const startFrame = 450;
  const prog = spring({
    fps,
    frame: frame - startFrame,
    config: { damping: 14, stiffness: 200, mass: 0.6 },
  });
  const pulse = Math.sin((frame - startFrame) * 0.12) * 0.03 + 1;
  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 270,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame - startFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
        transform: `scale(${interpolate(prog, [0, 1], [0.7, 1]) * pulse})`,
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #FF4D4D 0%, #C41230 100%)",
          borderRadius: 22,
          padding: "28px 52px",
          boxShadow: `0 0 60px rgba(255,77,77,0.6), 0 0 120px rgba(255,77,77,0.2)`,
          textAlign: "center",
          border: "2px solid rgba(255,150,150,0.4)",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: font.black, color: "#fff", letterSpacing: -0.5 }}>
          🚨 ChatGPT mentioned them. Not you.
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.85)", marginTop: 10, fontWeight: font.semibold }}>
          Find out why — and fix it in 30 min.
        </div>
      </div>
    </div>
  );
}

// CTA slides in at frame 540 (~18s)
function CtaBanner({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const startFrame = 540;
  const prog = spring({ fps, frame: frame - startFrame, config: { damping: 18, stiffness: 150 } });
  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 60,
        right: 60,
        transform: `translateY(${interpolate(prog, [0, 1], [80, 0])}px)`,
        opacity: interpolate(frame - startFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1A2A4A 0%, #0F1A30 100%)",
          border: "2px solid rgba(79,142,247,0.5)",
          borderRadius: 24,
          padding: "30px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 0 60px rgba(79,142,247,0.15)",
        }}
      >
        <div>
          <div style={{ fontSize: 36, fontWeight: font.black, color: colors.white }}>CiteLens</div>
          <div style={{ fontSize: 26, color: colors.muted, marginTop: 4 }}>citelens.app</div>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #4F8EF7 0%, #2563EB 100%)",
            borderRadius: 16,
            padding: "18px 36px",
            fontSize: 26,
            fontWeight: font.bold,
            color: "#fff",
            boxShadow: "0 0 30px rgba(79,142,247,0.5)",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          💬 Comment AUDIT{"\n"}I'll send your report
        </div>
      </div>
    </div>
  );
}

export function CompetitorHook() {
  const frame = useCurrentFrame();

  const visibleLines = CHAT_LINES.filter((l) => frame >= l.frame);

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Audio src={staticFile("audio/competitor.mp3")} />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(79,142,247,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <TopTag frame={frame} />

      {/* Chat window */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 50,
          right: 50,
          bottom: 290,
          background: "rgba(15,22,35,0.95)",
          borderRadius: 32,
          border: `1.5px solid ${colors.border}`,
          padding: "36px 40px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
        }}
      >
        {/* Chat header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 36,
            paddingBottom: 24,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              width: 52, height: 52, borderRadius: 26,
              background: "linear-gradient(135deg, #4F8EF7, #7B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, marginRight: 16,
            }}
          >
            ✦
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: font.bold, color: colors.white }}>
              ChatGPT
            </div>
            <div
              style={{
                fontSize: 22,
                color: colors.green,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 10, height: 10, borderRadius: 5,
                  background: colors.green,
                  display: "inline-block",
                }}
              />
              Active now
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {visibleLines.map((line) => (
            <ChatBubble
              key={line.frame}
              role={line.role as "user" | "ai"}
              text={line.text}
              entryFrame={line.frame}
              currentFrame={frame}
            />
          ))}
          {/* Typing dots between user question and first AI reply */}
          <TypingDots frame={frame} showAt={80} hideAt={175} />
          {/* Typing dots between first and second AI reply */}
          <TypingDots frame={frame} showAt={250} hideAt={325} />
        </div>
      </div>

      <AlertBadge frame={frame} />
      <CtaBanner frame={frame} />
    </AbsoluteFill>
  );
}

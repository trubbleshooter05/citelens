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

// 697 frames = 23.2s
// Beat map (VO-driven):
//  0-80    hook text appears
//  80-200  "I checked 5 AI tools" score ring counts up
//  200-420 platform bars fill one by one
//  420-540 "why" explanation cards
//  540-630 fix teaser drops in
//  630-697 hold on CTA

const PLATFORMS = [
  { name: "ChatGPT",      score: 38, color: "#4F8EF7", entryFrame: 170 },
  { name: "Perplexity",   score: 52, color: "#7B5CF6", entryFrame: 220 },
  { name: "Gemini",       score: 29, color: "#F59E0B", entryFrame: 270 },
  { name: "Claude",       score: 24, color: "#F97316", entryFrame: 320 },
  { name: "AI Overviews", score: 18, color: "#EF4444", entryFrame: 370 },
];

const OVERALL = 34;

const WHY_CARDS = [
  { icon: "📄", text: "No comparison page — AI can't answer \"X vs Y\" from your site" },
  { icon: "❓", text: "No FAQ schema — AI skips pages it can't parse into answers" },
  { icon: "📊", text: "No citable stat — competitors have numbers AI can quote" },
];

function Hook({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const prog = spring({ fps, frame, config: { damping: 18, stiffness: 140 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 60,
        right: 60,
        textAlign: "center",
        opacity: interpolate(prog, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `translateY(${interpolate(prog, [0, 1], [-40, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: 50,
          fontWeight: font.black,
          color: colors.white,
          lineHeight: 1.15,
        }}
      >
        I checked 5 AI tools.{" "}
        <span
          style={{
            color: colors.red,
            textShadow: `0 0 30px ${colors.red}`,
          }}
        >
          None recommended my site.
        </span>
      </div>
      <div
        style={{
          fontSize: 30,
          color: colors.muted,
          marginTop: 14,
          fontWeight: font.medium,
        }}
      >
        Here's what CiteLens found 👇
      </div>
    </div>
  );
}

function ScoreRing({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const startFrame = 80;
  const prog = spring({
    fps,
    frame: frame - startFrame,
    config: { damping: 22, stiffness: 60, mass: 1.4 },
  });

  const animatedScore = Math.round(
    interpolate(prog, [0, 1], [0, OVERALL], { extrapolateRight: "clamp" })
  );
  const circumference = 2 * Math.PI * 130;
  const strokeDashoffset = circumference * (1 - animatedScore / 100);
  const color = colors.red;

  const opacity = interpolate(frame - startFrame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
      }}
    >
      <div style={{ position: "relative", width: 290, height: 290 }}>
        <svg
          width={290}
          height={290}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={145}
            cy={145}
            r={130}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={16}
          />
          <circle
            cx={145}
            cy={145}
            r={130}
            fill="none"
            stroke={color}
            strokeWidth={16}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 14px ${color})` }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: font.black,
              color,
              textShadow: `0 0 40px ${colors.redGlow}`,
              lineHeight: 1,
            }}
          >
            {animatedScore}%
          </div>
          <div
            style={{
              fontSize: 22,
              color: colors.muted,
              fontWeight: font.semibold,
              marginTop: 4,
            }}
          >
            AI Citation Score
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          background: "rgba(255,77,77,0.12)",
          border: "1.5px solid rgba(255,77,77,0.35)",
          borderRadius: 14,
          padding: "14px 30px",
          fontSize: 26,
          fontWeight: font.bold,
          color: "#FF9090",
        }}
      >
        🚨 AI is sending buyers to your competitors
      </div>
    </div>
  );
}

function PlatformBar({
  platform,
  frame,
}: {
  platform: (typeof PLATFORMS)[0];
  frame: number;
}) {
  const { fps } = useVideoConfig();
  const prog = spring({
    fps,
    frame: frame - platform.entryFrame,
    config: { damping: 20, stiffness: 100 },
  });
  const barWidth = interpolate(prog, [0, 1], [0, platform.score], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(
    frame - platform.entryFrame,
    [0, 12],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <div style={{ marginBottom: 20, opacity }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: font.semibold,
            color: colors.white,
          }}
        >
          {platform.name}
        </span>
        <span
          style={{
            fontSize: 28,
            fontWeight: font.bold,
            color: platform.color,
          }}
        >
          {Math.round(barWidth)}%
        </span>
      </div>
      <div
        style={{
          height: 14,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 7,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barWidth}%`,
            background: platform.color,
            borderRadius: 7,
            boxShadow: `0 0 14px ${platform.color}`,
          }}
        />
      </div>
    </div>
  );
}

function WhyCard({
  card,
  index,
  frame,
  startFrame,
}: {
  card: { icon: string; text: string };
  index: number;
  frame: number;
  startFrame: number;
}) {
  const { fps } = useVideoConfig();
  const cardFrame = startFrame + index * 40;
  const prog = spring({
    fps,
    frame: frame - cardFrame,
    config: { damping: 18, stiffness: 180 },
  });
  const opacity = interpolate(frame - cardFrame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        background: "rgba(15,22,35,0.95)",
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: "22px 28px",
        marginBottom: 14,
        opacity,
        transform: `translateX(${interpolate(prog, [0, 1], [30, 0])}px)`,
      }}
    >
      <span style={{ fontSize: 36, flexShrink: 0 }}>{card.icon}</span>
      <span
        style={{
          fontSize: 28,
          color: colors.white,
          fontWeight: font.medium,
          lineHeight: 1.4,
        }}
      >
        {card.text}
      </span>
    </div>
  );
}

function WhyCards({ frame }: { frame: number }) {
  const startFrame = 430;
  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 290,
        left: 50,
        right: 50,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: font.bold,
          color: colors.muted,
          letterSpacing: 1,
          marginBottom: 18,
          opacity: interpolate(frame - startFrame, [0, 12], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        WHY AI SKIPS YOU
      </div>
      {WHY_CARDS.map((card, i) => (
        <WhyCard key={i} card={card} index={i} frame={frame} startFrame={startFrame} />
      ))}
    </div>
  );
}

function FixTeaser({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const startFrame = 560;
  const prog = spring({
    fps,
    frame: frame - startFrame,
    config: { damping: 16, stiffness: 180 },
  });
  if (frame < startFrame) return null;

  const items = [
    "Add comparison table to /card-grading",
    "Publish one citable stat AI can quote",
    "Add FAQ schema to top 3 pages",
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 50,
        right: 50,
        opacity: interpolate(frame - startFrame, [0, 14], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `translateY(${interpolate(prog, [0, 1], [70, 0])}px)`,
      }}
    >
      <div
        style={{
          background: "rgba(15,22,35,0.98)",
          border: `2px solid ${colors.borderBright}`,
          borderRadius: 26,
          padding: "32px 40px",
          boxShadow: "0 0 60px rgba(79,142,247,0.15)",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: font.bold,
            color: colors.accent,
            marginBottom: 18,
            letterSpacing: 1,
          }}
        >
          ✦ YOUR FIX LIST THIS WEEK
        </div>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 14,
              opacity: interpolate(
                frame - (startFrame + 20 + i * 15),
                [0, 10],
                [0, 1],
                { extrapolateRight: "clamp" }
              ),
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: colors.accent,
                boxShadow: `0 0 10px ${colors.accent}`,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: 29,
                color: colors.white,
                fontWeight: font.medium,
              }}
            >
              {item}
            </div>
          </div>
        ))}
        <div
          style={{
            marginTop: 22,
            paddingTop: 20,
            borderTop: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: font.bold,
              color: colors.white,
            }}
          >
            CiteLens · citelens.app
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #4F8EF7, #2563EB)",
              borderRadius: 14,
              padding: "14px 24px",
              fontSize: 24,
              fontWeight: font.bold,
              color: "#fff",
              boxShadow: "0 0 24px rgba(79,142,247,0.5)",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            💬 Comment AUDIT
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScoreReveal() {
  const frame = useCurrentFrame();

  // Phase detection
  const showBars = frame >= 150;
  const showWhyCards = frame >= 430;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 60%, rgba(255,77,77,0.07) 0%, ${colors.bg} 60%)`,
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Audio src={staticFile("audio/Validation Hook.mp3")} />

      <Hook frame={frame} />

      {/* Phase 1: Score ring + platform bars */}
      {!showWhyCards && (
        <div
          style={{
            position: "absolute",
            top: 270,
            left: 60,
            right: 60,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}
          >
            <ScoreRing frame={frame} />
          </div>

          {showBars && (
            <div
              style={{
                background: "rgba(15,22,35,0.9)",
                border: `1.5px solid ${colors.border}`,
                borderRadius: 24,
                padding: "30px 40px",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: font.bold,
                  color: colors.muted,
                  marginBottom: 20,
                  letterSpacing: 1,
                }}
              >
                CITATION SCORE BY PLATFORM
              </div>
              {PLATFORMS.map((p) => (
                <PlatformBar key={p.name} platform={p} frame={frame} />
              ))}
            </div>
          )}
        </div>
      )}

      <WhyCards frame={frame} />

      <FixTeaser frame={frame} />
    </AbsoluteFill>
  );
}

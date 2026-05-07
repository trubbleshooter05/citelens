import { Composition } from "remotion";
import { CompetitorHook } from "./scenes/CompetitorHook";
import { TaskBriefDemo } from "./scenes/TaskBriefDemo";
import { ScoreReveal } from "./scenes/ScoreReveal";

const W = 1080;
const H = 1920;
const FPS = 30;

export function Root() {
  return (
    <>
      {/* Scene 1: Competitor Hook — 633 frames / ~21s */}
      <Composition
        id="CompetitorHook"
        component={CompetitorHook}
        durationInFrames={633}
        fps={FPS}
        width={W}
        height={H}
      />

      {/* Scene 2: Task Brief Demo — 703 frames / ~23s */}
      <Composition
        id="TaskBriefDemo"
        component={TaskBriefDemo}
        durationInFrames={703}
        fps={FPS}
        width={W}
        height={H}
      />

      {/* Scene 3: Score Reveal / Validation Hook — 697 frames / ~23s */}
      <Composition
        id="ScoreReveal"
        component={ScoreReveal}
        durationInFrames={697}
        fps={FPS}
        width={W}
        height={H}
      />
    </>
  );
}

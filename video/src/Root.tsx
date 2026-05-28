import { Composition } from "remotion";
import { CITELENS_UGC_DURATION, CiteLensUgcDaily } from "./scenes/CiteLensUgcDaily";

const W = 1080;
const H = 1920;
const FPS = 30;

export function Root() {
  return (
    <Composition
      id="CiteLensUgcDaily"
      component={CiteLensUgcDaily}
      durationInFrames={CITELENS_UGC_DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
  );
}

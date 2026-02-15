import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { AMZNComposition } from "./AMZNComposition";
import { MSFTComposition } from "./MSFTComposition";
import { NVDAComposition } from "./NVDAComposition";
import { CombinedComposition } from "./CombinedComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AAPL-Stock-Chart"
        component={MyComposition}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AMZN-Stock-Chart"
        component={AMZNComposition}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MSFT-Stock-Chart"
        component={MSFTComposition}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NVDA-Stock-Chart"
        component={NVDAComposition}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Combined-Stock-Charts"
        component={CombinedComposition}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

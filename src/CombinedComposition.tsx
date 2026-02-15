import { Sequence, useCurrentFrame, interpolate, Easing } from 'remotion';
import { StockChart } from './StockChart';
import aaplData from './data/aapl_6m.json';
import amznData from './data/amzn.json';
import msftData from './data/msft.json';
import nvdaData from './data/nvda.json';

export const CombinedComposition = () => {
  const frame = useCurrentFrame();
  const chartDuration = 210; // 7 seconds at 30fps
  const transitionStart = 150; // Transition starts at 5 seconds into each chart

  // AAPL transitions (pan left during transition)
  const aaplTranslateX = interpolate(
    frame,
    [transitionStart, chartDuration],
    [0, -1920],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    }
  );

  // AMZN transitions (pan in at 150, pan out at 300)
  const amznTranslateX = interpolate(
    frame,
    [transitionStart, chartDuration, transitionStart * 2, transitionStart * 2 + 60],
    [1776, 0, 0, -1920],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    }
  );

  // MSFT transitions (pan in at 300, pan out at 450)
  const msftTranslateX = interpolate(
    frame,
    [transitionStart * 2, transitionStart * 2 + 60, transitionStart * 3, transitionStart * 3 + 60],
    [1776, 0, 0, -1920],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    }
  );

  // NVDA transitions (pan in at 450)
  const nvdaTranslateX = interpolate(
    frame,
    [transitionStart * 3, transitionStart * 3 + 60],
    [1557.496, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    }
  );

  return (
    <>
      <Sequence from={0} durationInFrames={chartDuration}>
        <StockChart
          symbol="AAPL"
          description="Apple Inc. - 6 Month Performance"
          stockData={aaplData}
          transitionTranslateX={aaplTranslateX}
        />
      </Sequence>
      <Sequence from={transitionStart} durationInFrames={chartDuration} style={{ zIndex: 2 }}>
        <StockChart
          symbol="AMZN"
          description="Amazon.com Inc. - Intraday Performance"
          stockData={amznData}
          transitionTranslateX={amznTranslateX}
        />
      </Sequence>
      <Sequence from={transitionStart * 2} durationInFrames={chartDuration} style={{ zIndex: 3 }}>
        <StockChart
          symbol="MSFT"
          description="Microsoft Corporation - 1 Year Performance"
          stockData={msftData}
          transitionTranslateX={msftTranslateX}
        />
      </Sequence>
      <Sequence from={transitionStart * 3} durationInFrames={chartDuration} style={{ zIndex: 4 }}>
        <StockChart
          symbol="NVDA"
          description="NVIDIA Corporation - 1 Year Performance"
          stockData={nvdaData}
          transitionTranslateX={nvdaTranslateX}
        />
      </Sequence>
    </>
  );
};

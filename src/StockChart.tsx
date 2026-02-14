import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import stockData from './data/aapl_6m.json';

interface StockDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const StockChart = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Parse the data
  const dataPoints: StockDataPoint[] = stockData.t.map((timestamp: number, i: number) => ({
    timestamp,
    open: stockData.o[i],
    high: stockData.h[i],
    low: stockData.l[i],
    close: stockData.c[i],
    volume: stockData.v[i],
  }));

  const totalPoints = dataPoints.length;
  
  // Animation parameters
  const REVEAL_DURATION = 5 * fps; // 5 seconds to reveal all data

  // Progressive reveal - show more data points over time
  const revealProgress = interpolate(
    frame,
    [0, REVEAL_DURATION],
    [0, 1],
    {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );
  const visiblePoints = Math.floor(revealProgress * totalPoints);
  const visibleData = dataPoints.slice(0, Math.max(1, visiblePoints));

  // Calculate price and volume ranges using ALL data (not just visible)
  const prices = dataPoints.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const maxVolume = Math.max(...dataPoints.map(d => d.volume));

  // Chart dimensions
  const chartPadding = { top: 60, right: 80, bottom: 120, left: 80 };
  const chartWidth = width - chartPadding.left - chartPadding.right;
  const chartHeight = height - chartPadding.top - chartPadding.bottom;
  const volumeHeight = 100; // Height reserved for volume bars
  const priceChartHeight = chartHeight - volumeHeight - 20;

  // Scale functions - use totalPoints so chart is stable as data appears
  const xScale = (index: number) => (index / Math.max(1, totalPoints - 1)) * chartWidth;
  const yScale = (price: number) => priceChartHeight - ((price - minPrice) / priceRange) * priceChartHeight;
  const volumeScale = (volume: number) => (volume / maxVolume) * volumeHeight;

  // Animation timing
  const { durationInFrames } = useVideoConfig();
  const midpoint = durationInFrames / 2;

  // Pan animation - start at (880, 200.491), end at (-460, 0)
  const panX = interpolate(
    frame,
    [0, durationInFrames],
    [880, -460],
    {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const panY = interpolate(
    frame,
    [0, durationInFrames],
    [200.491, 0],
    {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Zoom animation - start zoomed in, zoom out to normal by midpoint
  const zoomScale = interpolate(
    frame,
    [0, midpoint],
    [4, 1],
    {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  // Rotation animation - rotate around Y axis (vertical) as animation progresses
  const rotationY = interpolate(
    frame,
    [0, durationInFrames],
    [-20, -40],
    {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0e27',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '2000px',
      }}
    >
      <div
        style={{
          transform: `scale(${zoomScale}) rotateY(${rotationY}deg)`,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{
            overflow: 'visible',
            transform: `translate(${panX}px, ${panY}px)`,
          }}
        >
          {/* Candlesticks */}
          <g transform={`translate(${chartPadding.left}, ${chartPadding.top})`}>
            {visibleData.map((d, i) => {
              const x = xScale(i);
              const candleWidth = Math.max(2, chartWidth / totalPoints * 0.6);
              const isGreen = d.close >= d.open;
              const color = isGreen ? '#10b981' : '#ef4444';

              // Wick (high-low line)
              const wickTop = yScale(d.high);
              const wickBottom = yScale(d.low);

              // Body (open-close rectangle)
              const bodyTop = yScale(Math.max(d.open, d.close));
              const bodyBottom = yScale(Math.min(d.open, d.close));
              const bodyHeight = Math.max(1, bodyBottom - bodyTop);

              return (
                <g key={i}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={wickTop}
                    x2={x}
                    y2={wickBottom}
                    stroke={color}
                    strokeWidth={1}
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    stroke={color}
                    strokeWidth={1}
                  />
                  {/* Price label - only on most recent data point */}
                  {i === visibleData.length - 1 && (
                    <text
                      x={x + 15}
                      y={yScale(d.close)}
                      fill={color}
                      fontSize={18}
                      fontWeight="600"
                      dominantBaseline="middle"
                    >
                      ${d.close.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Volume bars */}
          <g transform={`translate(${chartPadding.left}, ${chartPadding.top + priceChartHeight + 20})`}>
            {visibleData.map((d, i) => {
              const x = xScale(i);
              const barWidth = Math.max(2, chartWidth / totalPoints * 0.6);
              const barHeight = volumeScale(d.volume);
              const isGreen = d.close >= d.open;
              const color = isGreen ? '#10b981' : '#ef4444';

              return (
                <rect
                  key={i}
                  x={x - barWidth / 2}
                  y={volumeHeight - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  opacity={0.5}
                />
              );
            })}
          </g>

          {/* Volume label */}
          <text
            x={chartPadding.left - 10}
            y={chartPadding.top + priceChartHeight + 20}
            fill="#6b7280"
            fontSize={12}
            textAnchor="end"
            dominantBaseline="hanging"
          >
            Volume
          </text>

          {/* Title */}
          <text
            x={width / 2}
            y={30}
            fill="#ffffff"
            fontSize={32}
            fontWeight="bold"
            textAnchor="middle"
          >
            AAPL Stock Performance
          </text>

          {/* Date range labels */}
          {visibleData.length > 0 && (
            <>
              <text
                x={chartPadding.left}
                y={height - 50}
                fill="#6b7280"
                fontSize={14}
                textAnchor="start"
              >
                {new Date(visibleData[0].timestamp * 1000).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </text>
              <text
                x={chartPadding.left + chartWidth}
                y={height - 50}
                fill="#6b7280"
                fontSize={14}
                textAnchor="end"
              >
                {new Date(visibleData[visibleData.length - 1].timestamp * 1000).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

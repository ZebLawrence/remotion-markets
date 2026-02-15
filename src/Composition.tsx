import { StockChart } from './StockChart';
import aaplData from './data/aapl_6m.json';

export const MyComposition = () => {
  return (
    <StockChart
      symbol="AAPL"
      description="Apple Inc. - 6 Month Performance"
      stockData={aaplData}
    />
  );
};

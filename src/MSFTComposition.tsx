import { StockChart } from './StockChart';
import msftData from './data/msft.json';

export const MSFTComposition = () => {
  return (
    <StockChart
      symbol="MSFT"
      description="Microsoft Corporation - 1 Year Performance"
      stockData={msftData}
    />
  );
};

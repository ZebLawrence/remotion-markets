import { StockChart } from './StockChart';
import amznData from './data/amzn.json';

export const AMZNComposition = () => {
  return (
    <StockChart
      symbol="AMZN"
      description="Amazon.com Inc. - Intraday Performance"
      stockData={amznData}
    />
  );
};

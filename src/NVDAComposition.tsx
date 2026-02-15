import { StockChart } from './StockChart';
import nvdaData from './data/nvda.json';

export const NVDAComposition = () => {
  return (
    <StockChart
      symbol="NVDA"
      description="NVIDIA Corporation - 1 Year Performance"
      stockData={nvdaData}
    />
  );
};

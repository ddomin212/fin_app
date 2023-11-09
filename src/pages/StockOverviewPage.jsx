import { useContext, useEffect, useState } from "react";
import PieChart from "../components/PieChart";
import { StockList } from "../components/StockOverview/StockList";
import SearchCredit from "../components/StockOverview/SearchCredit";
import { StocksContext } from "../context/stocksContext";

export const StockOverviewPage = ({ token }) => {
  const [showGraph, setShowGraph] = useState(0);
  const { stocks } = useContext(StocksContext);
  const [pieData, setPieData] = useState(stocks);

  useEffect(() => {
    const editData = async () => {
      setPieData({
        series: Object.values(stocks),
        labels: Object.keys(stocks),
      });
    };
    editData();
  }, [stocks]);

  console.log(pieData);

  return (
    <>
      <SearchCredit />
      <StockList />
      <button className="btn btn-primary" onClick={() => setShowGraph(1)}>
        Graph View
      </button>
      {showGraph !== 0 && <PieChart stocksData={pieData} />}
    </>
  );
};

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import finnHub from "../../utils/finnHub";
import DetailTable from "./DetailTable";
import BuySellStock from "./BuySellStock";

export const StockData = ({ symbol }) => {
  const [stockData, setStockData] = useState();
  const [stockPriceData, setStockPriceData] = useState();
  const [q, setQ] = useState("");

  const navigator = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchPriceData = async () => {
      try {
        const response = await finnHub.get("/quote", {
          params: {
            symbol: symbol,
          },
        });
        const data = {
          data: response.data,
          symbol: response.config.params.symbol,
        };
        console.log(data);
        if (isMounted) {
          setStockPriceData(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const fetchData = async () => {
      try {
        const response = await finnHub.get("/stock/profile2", {
          params: {
            symbol,
          },
        });
        if (isMounted) {
          setStockData(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    fetchPriceData();
    return () => (isMounted = false);
  }, [symbol]);

  return (
    <div>
      {stockData && (
        <>
          <BuySellStock
            q={q}
            setQ={setQ}
            symbol={symbol}
            navigator={navigator}
            stockPriceData={stockPriceData}
            stockData={stockData}
          />
          <DetailTable stockData={stockData} />
        </>
      )}
    </div>
  );
};

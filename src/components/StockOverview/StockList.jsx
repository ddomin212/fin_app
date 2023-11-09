import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import finnHub from "../../utils/finnHub";
import { WatchListContext } from "../../context/watchListContext";
import StockItem from "./StockItem";

export const StockList = () => {
  const [stock, setStock] = useState([]);

  const { watchList } = useContext(WatchListContext);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const finnHubStockData = await Promise.all(
        watchList.map((stock) => {
          return finnHub.get("/quote", {
            params: {
              symbol: stock,
            },
          });
        })
      );

      const data = finnHubStockData.map((response) => {
        return {
          data: response.data,
          symbol: response.config.params.symbol,
        };
      });

      if (isMounted) {
        setStock(data);
      }
    };

    fetchData();
    return () => (isMounted = false);
  }, [watchList]);

  const handleStockSelect = (symbol) => {
    navigate(`detail/${symbol}`);
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((stockData) => {
                  return StockItem({
                    handleStockSelect,
                    stockData,
                  });
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

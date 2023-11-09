import React, { useContext } from "react";
import { WatchListContext } from "../../context/watchListContext";
import { StocksContext } from "../../context/stocksContext";
import { BsEyeSlash } from "react-icons/bs";

function StockItem({ handleStockSelect, stockData }) {
  const { deleteStock } = useContext(WatchListContext);
  const { findStock } = useContext(StocksContext);
  return (
    <tr
      style={{ cursor: "pointer" }}
      onClick={() => handleStockSelect(stockData.symbol)}
      className="table-row"
      key={stockData.symbol}
    >
      <th scope="row">{stockData.symbol}</th>
      <td>{stockData.data.c}</td>
      <td>{findStock(stockData.symbol)}</td>
      <td>
        <BsEyeSlash
          onClick={(e) => {
            e.stopPropagation();
            deleteStock(stockData.symbol);
          }}
        />
      </td>
    </tr>
  );
}

export default StockItem;

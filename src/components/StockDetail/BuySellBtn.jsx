import React, { useContext } from "react";
import { StocksContext } from "../../context/stocksContext";

function BuySellBtn({ q, setQ, symbol, navigator, stockPriceData }) {
  const { buyStock, sellStock } = useContext(StocksContext);

  function generateButton({ tradeFunc, className }) {
    return (
      <button
        class={className}
        type="button"
        style={{ height: "48px" }}
        onClick={(e) => {
          if (Number(q) > 0) {
            tradeFunc(stockPriceData.data.pc, symbol, q);
          }
          setQ("");
          navigator("/dash");
          e.preventDefault();
        }}
      >
        {tradeFunc == buyStock ? "Buy" : "Sell"}
      </button>
    );
  }

  return (
    <>
      {generateButton({
        tradeFunc: buyStock,
        className: "btn btn-primary fs-5 me-2 py-2 px-4",
        q,
        setQ,
        symbol,
        navigator,
        stockPriceData,
      })}
      {generateButton({
        tradeFunc: sellStock,
        className: "btn btn-light fs-5 py-2 px-4",
        q,
        setQ,
        symbol,
        navigator,
        stockPriceData,
      })}
    </>
  );
}

export default BuySellBtn;

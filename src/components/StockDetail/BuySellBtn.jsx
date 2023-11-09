import React, { useContext } from "react";
import { StocksContext } from "../../context/stocksContext";

function BuySellBtn({
  quantity,
  setQuantity,
  symbol,
  navigator,
  stockPriceData,
}) {
  const { buyStock, sellStock } = useContext(StocksContext);

  function generateButton({ updateStocksFunc, className }) {
    return (
      <button
        class={className}
        type="button"
        style={{ height: "48px" }}
        onClick={(e) => {
          if (Number(quantity) > 0) {
            updateStocksFunc(stockPriceData.data.pc, symbol, quantity);
          }
          setQuantity("");
          navigator("/dash");
          e.preventDefault();
        }}
      >
        {updateStocksFunc == buyStock ? "Buy" : "Sell"}
      </button>
    );
  }

  return (
    <>
      {generateButton({
        updateStocksFunc: buyStock,
        className: "btn btn-primary fs-5 me-2 py-2 px-4",
        quantity,
        setQuantity,
        symbol,
        navigator,
        stockPriceData,
      })}
      {generateButton({
        updateStocksFunc: sellStock,
        className: "btn btn-light fs-5 py-2 px-4",
        quantity,
        setQuantity,
        symbol,
        navigator,
        stockPriceData,
      })}
    </>
  );
}

export default BuySellBtn;

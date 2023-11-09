import React from "react";
import BuySellBtn from "./BuySellBtn";
import NoStockInput from "./NoStockInput";

function BuySellStock({
  q,
  setQ,
  symbol,
  navigator,
  stockPriceData,
  stockData,
}) {
  return (
    <>
      <div class="container">
        <div class="text-center p-4 p-lg-5">
          <h1 class="fw-bold mb-4">{`${stockData.name} (${symbol})`}</h1>
          <NoStockInput q={q} setQ={setQ} />
          <BuySellBtn
            q={q}
            setQ={setQ}
            symbol={symbol}
            navigator={navigator}
            stockPriceData={stockPriceData}
          />
        </div>
      </div>
    </>
  );
}

export default BuySellStock;

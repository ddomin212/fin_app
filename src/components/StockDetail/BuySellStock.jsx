import React from "react";
import BuySellBtn from "./BuySellBtn";
import NoStockInput from "./NoStockInput";

function BuySellStock({
  quantity,
  setQuantity,
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
          <NoStockInput quantity={quantity} setQuantity={setQuantity} />
          <BuySellBtn
            quantity={quantity}
            setQuantity={setQuantity}
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

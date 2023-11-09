import React from "react";

function DetailTable({ stockData }) {
  return (
    <div className="row border bg-white rounded shadow-sm p-4 mt-5">
      <div className="col">
        <div>
          <span className="fw-bold">Exchange: </span>
          {stockData.exchange}
        </div>
        <div>
          <span className="fw-bold">Industry: </span>
          {stockData.finnhubIndustry}
        </div>
        <div>
          <span className="fw-bold">IPO: </span>
          {stockData.ipo}
        </div>
      </div>
      <div className="col">
        <div>
          <span className="fw-bold">MarketCap: </span>
          {stockData.marketCapitalization}
        </div>
        <div>
          <span className="fw-bold">Shares Outstanding: </span>
          {stockData.shareOutstanding}
        </div>
        <div>
          <span className="fw-bold">url: </span>
          <a href={stockData.weburl}>{stockData.weburl}</a>
        </div>
      </div>
    </div>
  );
}

export default DetailTable;

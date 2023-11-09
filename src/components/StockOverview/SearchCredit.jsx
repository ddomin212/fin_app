import React, { useContext } from "react";
import { AutoComplete } from "./AutoComplete";
import { StocksContext } from "../../context/stocksContext";

function SearchCredit() {
  const { credit } = useContext(StocksContext);

  return (
    <div className="container">
      <div className="row" style={{ alignItems: "center" }}>
        <div className="col-md-6">
          <AutoComplete />
        </div>
        <div className="col-md-6" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "18px", marginBottom: "4px" }}>
            You have {Number(credit).toFixed(2)} USD left on your account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SearchCredit;

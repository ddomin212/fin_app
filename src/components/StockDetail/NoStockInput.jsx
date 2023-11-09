import React from "react";

function NoStockInput({ quantity, setQuantity }) {
  return (
    <div
      class="container"
      style={{
        textAlign: "center",
        paddingTop: "0px",
        paddingBottom: "20px",
      }}
    >
      <input
        type="number"
        style={{ marginRight: "12px", maxWidth: "200px", height: "48px" }}
        placeholder="No. of stocks"
        value={quantity}
        onChange={(e) => {
          setQuantity(e.target.value);
        }}
      />
    </div>
  );
}

export default NoStockInput;

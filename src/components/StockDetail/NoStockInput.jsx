import React from "react";

function NoStockInput({ q, setQ }) {
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
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
        }}
      />
    </div>
  );
}

export default NoStockInput;

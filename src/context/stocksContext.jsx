import { createContext, useState, useEffect, useContext } from "react";
import { WatchListContext } from "./watchListContext";
import axios from "axios";
import { BASE_URL } from "../utils/settings";
import { backendRequest } from "../services/backendService";

export const StocksContext = createContext();

export const StocksContextProvider = (props) => {
  const [stocks, setStocks] = useState();
  const [credit, setCredit] = useState();
  const { deleteStock } = useContext(WatchListContext);

  const getCredit = async () => {
    backendRequest({
      method: "GET",
      props,
      path: "credit",
      responseFunc: (response) => {
        setCredit(response.data);
        localStorage.setItem("credit", response.data);
      },
    });
  };

  const getStocks = async () => {
    backendRequest({
      method: "GET",
      props,
      path: "stockBought",
      responseFunc: (response) => {
        if (Object.keys(response.data).length !== 0) {
          setStocks(response.data);
        } else {
          setStocks({ GOOGL: 0, MSFT: 0, AMZN: 0 });
        }
      },
    });
  };

  const updateCredit = (price, q) => {
    backendRequest({
      method: "POST",
      props,
      path: "updateCredit",
      data: {
        price: String(price),
        amount: String(q),
      },
    });
  };

  useEffect(() => {
    getCredit();
    getStocks();
  }, []);

  const updateDatabase = async (up, sym, key, q) => {
    const updates = JSON.stringify(up);
    backendRequest({
      method: "POST",
      props,
      path: key,
      data: {
        update: updates,
        symbol: sym,
        quant: q,
      },
    });
  };

  const buyStock = (price, stock, q) => {
    if (credit - price * q < 0) {
      throw new Error("Not enough funds");
    }
    updateCredit(price, q);
    if (stocks.hasOwnProperty(stock) === false) {
      let copyOfStocks1 = { ...stocks };
      copyOfStocks1[stock] = 0;
      copyOfStocks1[stock] += Number(q);
      updateDatabase(copyOfStocks1, stock, "buyStock", q);
      setStocks(copyOfStocks1);
    } else {
      let copyOfStocks2 = { ...stocks };
      copyOfStocks2[stock] += Number(q);
      updateDatabase(copyOfStocks2, stock, "buyStock", q);
      setStocks(copyOfStocks2);
    }
    getCredit();
  };

  const sellStock = (price, symbol, q) => {
    if (q > findStock(symbol)) {
      throw new Error("cannot sell stock you do not have");
    }
    let copyOfStocks = { ...stocks };
    if (stocks.hasOwnProperty(symbol) === true) {
      copyOfStocks[symbol] -= Number(q);
      if (copyOfStocks[symbol] < 0) {
        delete copyOfStocks[symbol];
        deleteStock(symbol);
      }
      setStocks(copyOfStocks);
    } else {
      throw new Error("FE -> cant sell stock you do not own");
    }
    updateDatabase(copyOfStocks, symbol, "sellStock", q);
    updateCredit("-" + price, q);
    getCredit();
  };

  const findStock = (symbol) => {
    if (stocks.hasOwnProperty(symbol) === false) {
      return 0;
    } else {
      return stocks[symbol];
    }
  };

  return (
    <StocksContext.Provider
      value={{
        credit,
        stocks,
        buyStock,
        sellStock,
        findStock,
        updateCredit,
        setCredit,
      }}
    >
      {props.children}
    </StocksContext.Provider>
  );
};

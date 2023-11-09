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

  const updateCredit = (price, quantity) => {
    backendRequest({
      method: "POST",
      props,
      path: "updateCredit",
      data: {
        price: String(price),
        amount: String(quantity),
      },
    });
  };

  useEffect(() => {
    getCredit();
    getStocks();
  }, []);

  const updateDatabase = async (up, sym, key, quantity) => {
    const updates = JSON.stringify(up);
    backendRequest({
      method: "POST",
      props,
      path: key,
      data: {
        update: updates,
        symbol: sym,
        quant: quantity,
      },
    });
  };

  const buyStock = (price, stock, quantity) => {
    if (credit - price * quantity < 0) {
      throw new Error("Not enough funds");
    }
    updateCredit(price, quantity);
    if (stocks.hasOwnProperty(stock) === false) {
      let copyOfStocks1 = { ...stocks };
      copyOfStocks1[stock] = 0;
      copyOfStocks1[stock] += Number(quantity);
      updateDatabase(copyOfStocks1, stock, "buyStock", quantity);
      setStocks(copyOfStocks1);
    } else {
      let copyOfStocks2 = { ...stocks };
      copyOfStocks2[stock] += Number(quantity);
      updateDatabase(copyOfStocks2, stock, "buyStock", quantity);
      setStocks(copyOfStocks2);
    }
    getCredit();
  };

  const sellStock = (price, symbol, quantity) => {
    if (quantity > findStock(symbol)) {
      throw new Error("cannot sell stock you do not have");
    }
    let copyOfStocks = { ...stocks };
    if (stocks.hasOwnProperty(symbol) === true) {
      copyOfStocks[symbol] -= Number(quantity);
      if (copyOfStocks[symbol] < 0) {
        delete copyOfStocks[symbol];
        deleteStock(symbol);
      }
      setStocks(copyOfStocks);
    } else {
      throw new Error("FE -> cant sell stock you do not own");
    }
    updateDatabase(copyOfStocks, symbol, "sellStock", quantity);
    updateCredit("-" + price, quantity);
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

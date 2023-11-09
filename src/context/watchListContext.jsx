import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/settings";
import { backendRequest } from "../services/backendService";

export const WatchListContext = createContext();
//["GOOGL", "MSFT", "AMZN"]
export const WatchListContextProvider = (props) => {
  const [watchList, setWatchList] = useState();

  const getDB = () => {
    backendRequest({
      method: "GET",
      props,
      path: "watchList",
      responseFunc: (response) => {
        if (response.data.length !== 0) {
          console.log(response.data);
          setWatchList(response.data);
        } else {
          setWatchList(["GOOGL", "AMZN", "MSFT"]);
        }
      },
    });
  };

  useEffect(() => {
    getDB();
  }, []);

  const updateDatabase = (up) => {
    const updates = JSON.stringify(up);
    backendRequest({
      method: "POST",
      props,
      path: "updateWatchList",
      data: {
        update: updates,
      },
    });
  };

  const addStock = (stock) => {
    let updates = watchList;
    if (updates.includes(stock) === false) {
      updates = [...updates, stock];
    }
    setWatchList(updates);
    updateDatabase(updates);
  };

  const deleteStock = (stock) => {
    let updates = watchList.filter((el) => {
      return el !== stock;
    });
    setWatchList(updates);
    updateDatabase(updates);
  };

  return (
    <WatchListContext.Provider value={{ watchList, addStock, deleteStock }}>
      {props.children}
    </WatchListContext.Provider>
  );
};

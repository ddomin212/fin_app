import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StockOverviewPage } from "./pages/StockOverviewPage";
import { StockDetailPage } from "./pages/StockDetailPage";
import "./App.css";
import { WatchListContextProvider } from "./context/watchListContext";
import { StocksContextProvider } from "./context/stocksContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Header from "./components/Header";
import useToken from "./utils/useToken";
import StaticLoad from "./pages/StaticLoad";

export default function App() {
  const { token, removeToken, setToken } = useToken();
  return (
    <main className="container">
      <BrowserRouter>
        {!token && token !== "" && token !== undefined ? (
          <div className="text-center">
            <Routes>
              <Route index element={<StaticLoad page="main.html" />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route
                path="/login"
                element={<Login setToken={setToken} />}
              ></Route>
            </Routes>
          </div>
        ) : (
          <>
            <WatchListContextProvider token={token}>
              <StocksContextProvider token={token}>
                <Header token={removeToken} />
                <Routes>
                  <Route path="/" element={<StaticLoad page="dash" />} />
                  <Route
                    path="/main.html"
                    element={<StaticLoad page="main.html" />}
                  ></Route>
                  <Route
                    path="/dash"
                    element={<StockOverviewPage token={token} />}
                  />
                  <Route
                    path="dash/detail/:symbol"
                    element={<StockDetailPage />}
                  />
                </Routes>
              </StocksContextProvider>
            </WatchListContextProvider>
          </>
        )}
      </BrowserRouter>
    </main>
  );
}

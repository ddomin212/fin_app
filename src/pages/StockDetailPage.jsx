import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import finnHub from "../utils/finnHub";
import { StockChart } from "../components/StockDetail/StockChart";
import { StockData } from "../components/StockDetail/StockData";

const formatData = (data) => {
  return data.t.map((el, index) => {
    return {
      x: el * 1000,
      y: [
        data.o[index].toFixed(2),
        data.h[index].toFixed(2),
        data.l[index].toFixed(2),
        data.c[index].toFixed(2),
      ],
    };
  });
};

export const StockDetailPage = () => {
  const [chartData, setChartData] = useState();
  const { symbol } = useParams();

  function setTimestamps() {
    const date = new Date();
    const currentTime = Math.floor(date.getTime() / 1000);
    let oneDay;
    if (date.getDay() === 6) {
      oneDay = currentTime - 2 * 24 * 60 * 60;
    } else if (date.getDay() === 0) {
      oneDay = currentTime - 3 * 24 * 60 * 60;
    } else {
      oneDay = currentTime - 24 * 60 * 60;
    }
    const oneWeek = currentTime - 7 * 24 * 60 * 60;
    const oneYear = currentTime - 365 * 24 * 60 * 60;
    return { oneDay, oneWeek, oneYear, currentTime };
  }

  function candleChart({ symbol, timeframe, currentTime, resolution }) {
    return finnHub.get("/stock/candle", {
      params: {
        symbol,
        from: timeframe,
        to: currentTime,
        resolution: resolution,
      },
    });
  }

  async function getCandleCharts({
    symbol,
    oneDay,
    oneWeek,
    oneYear,
    currentTime,
  }) {
    try {
      const responses = await Promise.all([
        candleChart({ symbol, timeframe: oneDay, currentTime, resolution: 30 }),
        candleChart({
          symbol,
          timeframe: oneWeek,
          currentTime,
          resolution: "D",
        }),
        candleChart({
          symbol,
          timeframe: oneYear,
          currentTime,
          resolution: "W",
        }),
      ]);

      setChartData({
        day: formatData(responses[0].data),
        week: formatData(responses[1].data),
        year: formatData(responses[2].data),
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const { oneDay, oneWeek, oneYear, currentTime } = setTimestamps();
      await getCandleCharts({ symbol, oneDay, oneWeek, oneYear, currentTime });
    };
    fetchData();
  }, [symbol]);

  return (
    <div>
      {chartData && (
        <div>
          <StockData symbol={symbol} />
          <StockChart chartData={chartData} symbol={symbol} />
        </div>
      )}
    </div>
  );
};

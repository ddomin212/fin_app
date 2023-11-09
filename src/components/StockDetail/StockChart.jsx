import Chart from "react-apexcharts";
import { useState } from "react";

export const StockChart = ({ chartData, symbol }) => {
  const [dateFormat, setDateFormat] = useState("24h");
  const { day, week, year } = chartData;

  const determineTimeFormat = () => {
    switch (dateFormat) {
      case "24h":
        return day;
      case "7d":
        return week;
      case "1y":
        return year;
      default:
        return day;
    }
  };

  const series = [
    {
      name: symbol,
      data: determineTimeFormat(),
    },
  ];

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: `${series[0].name}`,
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#00B746",
          downward: "#EF403C",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
  };

  console.log(series);

  const renderButtonSelect = (button) => {
    const className = "btn m-1 ";
    if (button === dateFormat) {
      return className + "btn-primary";
    } else {
      return className + "btn-outline-primary";
    }
  };

  return (
    <>
      <div className="mt-5 p-4 shadow-sm bg-white">
        <Chart
          options={options}
          series={series}
          type="candlestick"
          width="100%"
        />
        <div>
          <button
            className={renderButtonSelect("24h")}
            onClick={() => setDateFormat("24h")}
          >
            24h
          </button>
          <button
            className={renderButtonSelect("7d")}
            onClick={() => setDateFormat("7d")}
          >
            7d
          </button>
          <button
            className={renderButtonSelect("1y")}
            onClick={() => setDateFormat("1y")}
          >
            1y
          </button>
        </div>
      </div>
    </>
  );
};

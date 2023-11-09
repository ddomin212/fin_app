import Chart from "react-apexcharts";

function PieChart({ stocksData }) {
  const options = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: stocksData.labels,
    responsive: [
      {
        labels: stocksData.labels,
        breakpoint: 500,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div
      className="mt-5 p-4 shadow-sm bg-white"
      style={{ textAlign: "center" }}
    >
      <Chart
        options={options}
        series={stocksData.series}
        type="donut"
        width="500"
      />
    </div>
  );
}

export default PieChart;

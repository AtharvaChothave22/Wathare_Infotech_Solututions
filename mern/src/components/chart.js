import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const ChartComponent = () => {
  const [chartData, setChartData] = useState({});
  const [summaryData, setSummaryData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/data`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        const data = response.data;

        const labels = data.map((item) => {
          const date = new Date(item.ts);
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
        });
        const machineStatusData = data.map((item) => item.machine_status);

        const onesCount = machineStatusData.filter(
          (value) => value === 1
        ).length;
        const zerosCount = machineStatusData.filter(
          (value) => value === 0
        ).length;

        let continuousZeros = 0;
        let continuousOnes = 0;
        let maxContinuousZeros = 0;
        let maxContinuousOnes = 0;

        for (const value of machineStatusData) {
          if (value === 0) {
            continuousZeros++;
            continuousOnes = 0;
            if (continuousZeros > maxContinuousZeros) {
              maxContinuousZeros = continuousZeros;
            }
          } else if (value === 1) {
            continuousOnes++;
            continuousZeros = 0;
            if (continuousOnes > maxContinuousOnes) {
              maxContinuousOnes = continuousOnes;
            }
          }
        }

        setSummaryData({
          onesCount: onesCount,
          zerosCount: zerosCount,
          maxContinuousZeros: maxContinuousZeros,
          maxContinuousOnes: maxContinuousOnes,
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Machine Status",
              data: machineStatusData,
              backgroundColor: machineStatusData.map((value) => {
                if (value === 0)
                  return "rgba(255, 255, 0, 0.2)";
                else if (value === 1)
                  return "rgba(0, 255, 0, 0.2)"; 
                else return "rgba(255, 0, 0, 0.2)"; // Red for missing
              }),
              borderColor: machineStatusData.map((value) => {
                if (value === 0) return "rgba(255, 255, 0, 1)";
                else if (value === 1) return "rgba(0, 255, 0, 1)";
                else return "rgba(255, 0, 0, 1)";
              }),
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center text-2xl">
      {isLoading ? (
        <p className="mt-40 text-bold">Loading data.....</p>
      ) : (
        <div>
          <div className="ml-20">
            <h2 className="py-4 px-36 font-bold">Chart</h2>
            <div className="w-96 h-48">
              <Line
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                      },
                    },
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="mt-8 ml-20" style={{ marginTop: "2rem", paddingLeft: "20px", paddingRight: "20px" }}>
  <h2 className="font-bold text-xl">Required options</h2>
  <table className="mt-4" style={{ marginTop: "1rem" }}>
    <thead>
      <tr>
        <th className="px-4 py-2">Number of 1s</th>
        <th className="px-4 py-2">Number of 0s</th>
        <th className="px-4 py-2">Max Continuous 0s</th>
        <th className="px-4 py-2">Max Continuous 1s</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="px-4 py-2">{summaryData.onesCount}</td>
        <td className="px-4 py-2">{summaryData.zerosCount}</td>
        <td className="px-4 py-2">{summaryData.maxContinuousZeros}</td>
        <td className="px-4 py-2">{summaryData.maxContinuousOnes}</td>
      </tr>
    </tbody>
  </table>
</div>

        </div>
      )}
    </div>
  );
};

export default ChartComponent;

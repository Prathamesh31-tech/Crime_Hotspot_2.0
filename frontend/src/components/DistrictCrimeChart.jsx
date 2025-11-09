
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./DistrictCrimeChart.css";

const districts = [
  "Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Jalgaon",
  "Amravati", "Kolhapur", "Nanded", "Sangli", "Latur", "Ahmednagar", "Chandrapur", "Parbhani"
];

const DistrictCrimeChart = () => {
  const [selected, setSelected] = useState("Mumbai");
  const [counts, setCounts] = useState({ high: 0, medium: 0, low: 0 });
  const [topHighCrime, setTopHighCrime] = useState([]);
  const [topMediumCrime, setTopMediumCrime] = useState([]);
  const [topLowCrime, setTopLowCrime] = useState([]);

  // Fetch selected district data
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/district/${selected}`)
      .then((res) => setCounts(res.data.counts))
      .catch((err) => console.error("Fetch district error:", err));
  }, [selected]);

  // Fetch Top 3 High-Level Crimes
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/top-high-crime")
      .then((res) => setTopHighCrime(res.data))
      .catch((err) => console.error("Fetch top high crime error:", err));
  }, []);

  // Fetch Top 3 Medium-Level Crimes
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/top-medium-crime")
      .then((res) => setTopMediumCrime(res.data))
      .catch((err) => console.error("Fetch top medium crime error:", err));
  }, []);

  // Fetch Top 3 Low-Level Crimes
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/top-low-crime")
      .then((res) => setTopLowCrime(res.data))
      .catch((err) => console.error("Fetch top low crime error:", err));
  }, []);

  // Bar chart for selected district
  const data = {
    labels: ["High-Level Crime", "Medium-Level Crime", "Low-Level Crime"],
    datasets: [
      {
        label: `Crime Levels in ${selected}`,
        data: [counts.high, counts.medium, counts.low],
        backgroundColor: ["#ff0000", "#ffa500", "#ffff00"],
      },
    ],
  };

  // Pie chart data
  const highPieData = {
    labels: topHighCrime.map((d) => d.district),
    datasets: [
      {
        label: "Top 3 High-Level Crime Districts",
        data: topHighCrime.map((d) => d.count),
        backgroundColor: ["#ff0000ff", "#ff4c4cff", "#fb9391ff"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const mediumPieData = {
    labels: topMediumCrime.map((d) => d.district),
    datasets: [
      {
        label: "Top 3 Medium-Level Crime Districts",
        data: topMediumCrime.map((d) => d.count),
        backgroundColor: ["#ffa500ff", "#ffb84cff", "#ffd19cff"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const lowPieData = {
    labels: topLowCrime.map((d) => d.district),
    datasets: [
      {
        label: "Top 3 Low-Level Crime Districts",
        data: topLowCrime.map((d) => d.count),
        backgroundColor: ["#ffea00ff", "#f4ff78ff", "#ffffffff"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: { legend: { labels: { color: "white" } } },
    scales: {
      y: { ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.2)" } },
      x: { ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.2)" } },
    },
  };

  return (
    <div className="main" style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
      <div className="district-chart-container">
        <h2>📊 District Crime Visualization</h2>
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {districts.map((d) => <option key={d}>{d}</option>)}
        </select>
        <Bar data={data} options={options} />
      </div>

      <div className="pieChart">
        <div className="top-crime-chart">
          <h4 style={{ color: "white" }}>🔴 Top 3 High-Level</h4>
          <Pie data={highPieData} />
        </div>

        <div className="top-crime-chart">
          <h4 style={{ color: "white" }}>🟠 Top 3 Medium-Level</h4>
          <Pie data={mediumPieData} />
        </div>

        <div className="top-crime-chart">
          <h4 style={{ color: "white" }}>🟡 Top 3 Low-Level</h4>
          <Pie data={lowPieData} />
        </div>
      </div>
    </div>
  );
};

export default DistrictCrimeChart;

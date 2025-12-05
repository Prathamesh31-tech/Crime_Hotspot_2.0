import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./DistrictCrimeChart.css";

const districts = [
  "Ahmednagar", "Akola","Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
  "Chandrapur", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur",
  "Latur","Mumbai","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad",
  "Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg",
  "Solapur","Thane","Wardha","Washim","Yavatmal"
];

// Lat/Lng -> District mapping
const latLngToDistrict = (lat, lng) => {
  const mapping = [
    { district: "Ahmednagar", lat: 19.0952, lng: 74.7496 },
    { district: "Akola", lat: 20.7010, lng: 77.0048 },
    { district: "Amravati", lat: 20.9333, lng: 77.7500 },
    { district: "Aurangabad", lat: 19.8762, lng: 75.3433 },
    { district: "Beed", lat: 18.9904, lng: 75.7600 },
    { district: "Bhandara", lat: 21.1806, lng: 79.5973 },
    { district: "Buldhana", lat: 20.4283, lng: 76.1641 },
    { district: "Chandrapur", lat: 19.9614, lng: 79.2961 },
    { district: "Gadchiroli", lat: 20.1250, lng: 80.0500 },
    { district: "Gondia", lat: 21.4580, lng: 80.1921 },
    { district: "Hingoli", lat: 19.7161, lng: 77.1366 },
    { district: "Jalgaon", lat: 21.0076, lng: 75.5620 },
    { district: "Jalna", lat: 19.8436, lng: 75.8873 },
    { district: "Kolhapur", lat: 16.7050, lng: 74.2433 },
    { district: "Latur", lat: 18.4065, lng: 76.5601 },
    { district: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { district: "Mumbai Suburban", lat: 19.1553, lng: 72.8505 },
    { district: "Nagpur", lat: 21.1458, lng: 79.0882 },
    { district: "Nanded", lat: 19.1536, lng: 77.3210 },
    { district: "Nandurbar", lat: 21.4896, lng: 74.2537 },
    { district: "Nashik", lat: 20.0110, lng: 73.7902 },
    { district: "Osmanabad", lat: 18.1850, lng: 76.0415 },
    { district: "Palghar", lat: 19.6870, lng: 72.7490 },
    { district: "Parbhani", lat: 19.2700, lng: 76.7600 },
    { district: "Pune", lat: 18.5204, lng: 73.8567 },
    { district: "Raigad", lat: 18.3452, lng: 73.2260 },
    { district: "Ratnagiri", lat: 16.9900, lng: 73.3003 },
    { district: "Sangli", lat: 16.8522, lng: 74.5636 },
    { district: "Satara", lat: 17.6800, lng: 73.9900 },
    { district: "Sindhudurg", lat: 15.9010, lng: 73.7821 },
    { district: "Solapur", lat: 17.6599, lng: 75.9064 },
    { district: "Thane", lat: 19.2183, lng: 73.0933 },
    { district: "Wardha", lat: 20.7411, lng: 78.6030 },
    { district: "Washim", lat: 20.1225, lng: 76.1080 },
    { district: "Yavatmal", lat: 19.6943, lng: 78.1348 },
  ];

  const closest = mapping.reduce((prev, curr) => {
    const distPrev = Math.hypot(prev.lat - lat, prev.lng - lng);
    const distCurr = Math.hypot(curr.lat - lat, curr.lng - lng);
    return distCurr < distPrev ? curr : prev;
  });

  return closest.district || "Unknown";
};

const DistrictCrimeChart = () => {
  const [selected, setSelected] = useState("Mumbai");
  const [counts, setCounts] = useState({ high: 0, medium: 0, low: 0 });
  const [topHighCrime, setTopHighCrime] = useState([]);
  const [topMediumCrime, setTopMediumCrime] = useState([]);
  const [topLowCrime, setTopLowCrime] = useState([]);
  const [topSafeHigh, setTopSafeHigh] = useState([]);
  const [topSafeMedium, setTopSafeMedium] = useState([]);
  const [topSafeLow, setTopSafeLow] = useState([]);

  const pieOptions = {
    plugins: { tooltip: { enabled: false }, legend: { labels: { color: "white" } } },
    hover: { mode: null }
  };

  useEffect(() => {
    axios
      .get(`https://crime-hotspot-2-0-5.onrender.com/api/district/${selected}`)
      .then((res) => setCounts(res.data.counts))
      .catch((err) => console.error("Fetch district error:", err));
  }, [selected]);

  const convertDistrictData = (data) => {
    return data.map((d) => {
      let districtName = d.district;
      if (districtName.includes("lat") && districtName.includes("lng")) {
        try {
          const obj = JSON.parse(d.district.replace(/([a-zA-Z]+):/g, '"$1":'));
          districtName = latLngToDistrict(obj.lat, obj.lng);
        } catch {
          districtName = "Unknown";
        }
      }
      return { ...d, district: districtName };
    });
  };

  useEffect(() => {
    axios.get("https://crime-hotspot-2-0-5.onrender.com/api/top-high-crime").then((res) => setTopHighCrime(convertDistrictData(res.data))).catch(console.error);
    axios.get("https://crime-hotspot-2-0-5.onrender.com/api/top-medium-crime").then((res) => setTopMediumCrime(convertDistrictData(res.data))).catch(console.error);
    axios.get("https://crime-hotspot-2-0-5.onrender.com/api/top-low-crime").then((res) => setTopLowCrime(convertDistrictData(res.data))).catch(console.error);
    axios.get("https://crime-hotspot-2-0-5.onrender.com/api/safe-high-crime").then((res) => setTopSafeHigh(convertDistrictData(res.data))).catch(console.error);
    axios.get("https://crime-hotspot-2-0-5.onrender.com/api/safe-medium-crime").then((res) => setTopSafeMedium(convertDistrictData(res.data))).catch(console.error);
    axios.get("https://crime-hotspot-2-0-5.onrender.com/api/safe-low-crime").then((res) => setTopSafeLow(convertDistrictData(res.data))).catch(console.error);
  }, []);

  const data = {
    labels: ["High-Level", "Medium-Level ", "Low-Level"],
    datasets: [
      { label: `Crime Levels in ${selected}`, data: [counts.high, counts.medium, counts.low], backgroundColor: ["#ff0000", "#ffa500", "#ffff00"] },
    ],
  };

  const barOptions = {
    plugins: { legend: { labels: { color: "white" } } },
    scales: {
      y: { ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.2)" } },
      x: { ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.2)" } },
    },
  };

  const generatePieData = (arr, label, colors) => ({
    labels: arr.map(d => d.district),
    datasets: [{ label, data: arr.map(d => d.count), backgroundColor: colors, borderColor: "white", borderWidth: 2 }]
  });

  return (
    <div className="main-container">
      <div className="district-chart-container">
        <div className="graphheading">📊 District Crime Visualization</div>
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {districts.map(d => <option key={d}>{d}</option>)}
        </select>
        <Bar data={data} options={barOptions} />
      </div>

      <div className="pieChart">
        {[ 
          { title: "Top 3 High Crime", data: topHighCrime, colors: ["#ff0000ff", "#ff4c4cff", "#fb9391ff"] },
          { title: "Top 3 Medium Crime", data: topMediumCrime, colors: ["#ffa500ff", "#ffb84cff", "#ffd19cff"] },
          { title: "Top 3 Low Crime", data: topLowCrime, colors: ["#ffea00ff", "#f4ff78ff", "#ffffffff"] },
          { title: "Top 3 Safe (High Crime)", data: topSafeHigh, colors: ["#00ff00ff", "#4cff4cff", "#91fb91ff"] },
          { title: "Top 3 Safe (Medium Crime)", data: topSafeMedium, colors: ["#00aaffff", "#4ccfff", "#91e0fbff"] },
          { title: "Top 3 Safe (Low Crime)", data: topSafeLow, colors: ["#aa00ffff", "#cc4cff", "#e091fbff"] },
        ].map((chart, idx) => (
          <div key={idx} className="top-crime-chart">
            <h4 style={{ color: "white" }}>{chart.title}</h4>
            <Pie data={generatePieData(chart.data, chart.title, chart.colors)} options={pieOptions} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistrictCrimeChart;

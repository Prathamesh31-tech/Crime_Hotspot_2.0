import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./CrimeMap.css";

// Component to fly to the new location
const FlyTo = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13);
    }
  }, [coords, map]);
  return null;
};

const CrimeMap = () => {
  const [posts, setPosts] = useState([]);
  const [mapCenter, setMapCenter] = useState([19.076, 72.8777]);
  const [locationQuery, setLocationQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);

    fetch("http://localhost:8080/api/heatmap")
      .then((res) => res.json())
      .then(setPosts)
      .catch((err) => console.error("🔥 Fetch error:", err));

    return () => clearTimeout(timer);
  }, []);

  const handleLocationSearch = async () => {
    if (!locationQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationQuery
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  return (
    <div className="crime-map-container">
      {/* Header stays separate */}
      <div className="map-heading">🚨 Smart Crime Heatmap 🚨</div>

      {/* Map container */}
      <div className="map-container-wrapper">
        {/* Floating search bar */}
          {!loading && (
             <div className="location-search">
                    <input
                      type="text"
                      placeholder="Search location"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
          />
      <button onClick={handleLocationSearch}>Search</button>
    </div>
  )}


        {loading ? (
          <div className="news">  
            <span className="live" style={{ height: "20px" }}>
              LIVE
            </span>
            Loading map....
        </div>

    
        ) : (
          <MapContainer center={mapCenter} zoom={12} className="crime-map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FlyTo coords={mapCenter} />

            {posts.map((report, idx) => {
              let color = "green";
              let fillColor = "green";
              let labelText = "✅ Normal Activity";

              if (report.label === 2) {
                color = "red";
                fillColor = "#ff0000";
                labelText = "🔴 High-Level Crime";
              } else if (report.label === 1) {
                color = "orange";
                fillColor = "#ffa500";
                labelText = "🟠 Medium-Level Crime";
              } else if (report.label === 0) {
                color = "yellow";
                fillColor = "#ffff00";
                labelText = "🟡 Low-Level Crime";
              }

              const offsetLat =
                report.location.lat + (Math.random() - 0.5) * 0.002;
              const offsetLng =
                report.location.lng + (Math.random() - 0.5) * 0.002;

              return (
                <Circle
                  key={`${report.location.lat}-${report.location.lng}-${idx}`}
                  center={[offsetLat, offsetLng]}
                  radius={150}
                  pathOptions={{ color, fillColor, fillOpacity: 0.6 }}
                >
                  <Popup>
                    <strong>{labelText}</strong>
                    <br />
                    {report.text.split(".")[0]}
                    <br />
                    <small>
                      Lat: {report.location.lat}, Lng: {report.location.lng}
                    </small>
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>
        )}
      </div>
        <div className={loading ? "map-placeholder" : ""}></div>
      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card high">
          <h3 style={{ color: "red" }}>High-Level Crimes</h3>
          <p>{posts.filter((p) => p.label === 2).length}</p>
        </div>
        <div className="summary-card medium">
          <h3 style={{ color: "orange" }}>Medium-Level Crimes</h3>
          <p>{posts.filter((p) => p.label === 1).length}</p>
        </div>
        <div className="summary-card low">
          <h3 style={{ color: "yellow" }}>Low-Level Crimes</h3>
          <p>{posts.filter((p) => p.label === 0).length}</p>
        </div>
        <div className="summary-card total">
          <h3>Total</h3>
          <p>{posts.length}</p>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;

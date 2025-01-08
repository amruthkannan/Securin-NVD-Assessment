import React, { useState, useEffect } from "react";
import axios from "axios";

import { Link } from "react-router-dom";

const CveList = () => {
  const [cves, setCves] = useState([]); // Initialize as empty array
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCves = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cves/list");
        console.log("Fetched CVEs:", response.data); // Debugging log
        setCves(response.data.records || []); // Update data to match your API response format
        setError("");
      } catch (err) {
        console.error("Error fetching CVE data:", err.message);
        setError("Failed to load CVE data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCves();
  }, []);

  return (
    <div>
      <h1>CVE List</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Source Identifier</th>
            <th>Published Date</th>
            <th>Last Modified Date</th>
            <th>Vulnerability Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(cves) && cves.length > 0 ? (
            cves.map((cve) => (
              <tr key={cve.cveId}>
                <td>
                  <Link to={`/cve/${cve.cveId}`}>{cve.cveId}</Link>
                </td>
                <td>{cve.sourceIdentifier || "N/A"}</td>
                <td>
                  {cve.published
                    ? new Date(cve.published).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {cve.lastModified
                    ? new Date(cve.lastModified).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{cve.vulnStatus || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No records found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>Total Records: {cves.length}</p>
    </div>
  );
};

export default CveList;
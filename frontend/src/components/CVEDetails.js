import { useParams, Link } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";

const CVEDetails = () => {
  const { id } = useParams();
  const [cveDetails, setCveDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/cves/${id}`);
        setCveDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching CVE details", error);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Link to="/">Back to List</Link>
      <h1>{cveDetails.cveId}</h1>
      <p><strong>Description:</strong> {cveDetails.description || "N/A"}</p>
      <h2>CVSS V2 Metrics</h2>
      <table>
        <thead>
          <tr>
            <th>Vector String</th>
            <th>Severity</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{cveDetails.vectorString || "N/A"}</td>
            <td>{cveDetails.severity || "N/A"}</td>
            <td>{cveDetails.score || "N/A"}</td>
          </tr>
        </tbody>
      </table>
      <h2>Scores</h2>
      <p><strong>Exploitability Score:</strong> {cveDetails.exploitabilityScore || "N/A"}</p>
      <p><strong>Impact Score:</strong> {cveDetails.impactScore || "N/A"}</p>
      <h2>CPE</h2>
      <table>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Match Criteria ID</th>
            <th>Vulnerable</th>
          </tr>
        </thead>
        <tbody>
          {cveDetails.cpe.map((cpe, index) => (
            <tr key={index}>
              <td>{cpe.criteria}</td>
              <td>{cpe.matchCriteriaId}</td>
              <td>{cpe.vulnerable ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CVEDetails;

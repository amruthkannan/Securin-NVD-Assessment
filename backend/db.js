// Import dependencies
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const dbName = 'Securin';
const client = new MongoClient(uri);

// Initialize app and middleware
const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// Connect to MongoDB
let cveCollection;
async function connectDB() {
  try {
    await client.connect();
    console.log('MongoDB connected');
    const db = client.db(dbName);
    cveCollection = db.collection('cves');
  } catch (err) {
    console.error('Error: ', err);
  }
}
connectDB();
// Fetch CVE data from NVD API and store it in MongoDB
  async function fetchCVEData(startIndex = 0, resultsPerPage = 1000) {
    try {
  
      const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`);
  
      if (response.data && response.data.vulnerabilities) {
        const transformedArray = [];
        for (const item of response.data.vulnerabilities) {
          if (item.cve) {
            const { cve } = item;
            //console.log(item.metrics.cvssMetricV2);
            // const baseScore = item.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || item.metrics?.cvssMetricV3?.[0]?.cvssData?.baseScore;
          // Spread the cve object into a new object and push it to the new array
            transformedArray.push({ ...cve,cveId:item.cve.id});
          }
       }
        const result = await cveCollection.insertMany(transformedArray);
    
        console.log(result);
        // console.log(`${result.insertedCount} CVE(s) inserted`);
        console.log(response.data.vulnerabilities);
        return response.data.vulnerabilities;
      } else {
        console.error('No vulnerabilities found in the API response.');
        return [];
      } 
    } catch (error) {
      console.error('Error fetching data from NVD:', error);
      return [];
    }
  }
  fetchCVEData();  

module.exports = fetchCVEData;
// API Endpoints

// 1. Fetch and store CVE data from NVD and insert it into the database


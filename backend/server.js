const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const { MongoClient } = require('mongodb');
//const {fetchCVEData} = require('./db');

const uri = 'mongodb://localhost:27017';
const dbName = 'Securin';
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

let cveCollection;
async function connectDB() {
  try {
    await client.connect();
    console.log('MongoDB connected1');
    const db = client.db(dbName);
    cveCollection = db.collection('cves');
  } catch (err) {
    console.error('Error: ', err);
  }
}
connectDB();

// 2. Get paginated and sorted list of CVEs
app.get('/cves/list', async (req, res) => {
  try {
    if (!cveCollection) {
      return res.status(500).json({ message: 'Collection not initialized' });
    }

    const records = await cveCollection.find().limit(10).toArray();
    res.json({ records });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Error fetching records', error });
  }
});



// 3. Get a specific CVE by ID
app.get('/cves/:id', async (req, res) => {
  try {
    const cve = await cveCollection.findOne({ cveId: req.params.id });
    if (!cve) return res.status(404).json({ message: 'CVE not found' });
    res.json(cve);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CVE', error });
  }
});

app.get('/cves/:id/:year', async (req, res) => {
  const {year} = req.params;
  try {
    const cve = await cveCollection.findOne({ cveId: req.params.id });
    if (!cve) return res.status(404).json({ message: 'CVE not found' });
    res.json(cve);
    const cves = await cveCollection.find({ cveId: { $regex: `^CVE-${year}` } }).toArray();

    if (cves.length===0){
      return res.status(404).json({ message: `No CVEs found for the year ${year}` });
    }
    res.json({year,cves});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CVE', error });
  }
});

app.get('/cves/:score', (req, res) => {
  const { score } = req.query; // Get score from query parameter
  if (!score) {
    return res.status(400).json({ message: 'Please provide a baseScore in the query parameters.' });
  }

  const filteredCVE = cveData.filter((cve) => cve.baseScore && cve.baseScore === parseFloat(score));
  if (filteredCVE.length === 0) {
    return res.status(404).json({ message: 'No CVEs found with the specified baseScore.' });
  }

  res.json(filteredCVE);
});

//N modified days
app.get('/cves/:days', async (req, res) => {
  const { days } = req.query; // Accept `days` as a query parameter
  if (!days || isNaN(days)) {
    return res.status(400).json({ message: 'Invalid number of days' });
  }
  const daysAgo = parseInt(days);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);
  const records = await cveCollection
      .find({ lastModified: { $gte: startDate } })
      .toArray();
  res.json({
        message: `Records modified in the last ${days} day(s)`,
        count: records.length,
        records,
        });
});
// Start the server and initialize database connection
async function startServer() {
    const PORT = 5000;
    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
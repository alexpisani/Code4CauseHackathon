const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS to allow requests from the React frontend
app.use(cors());

// Define the route for handling search
app.get('/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  try {
    const response = await axios.get(`http://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=10`);
    const entries = parseArxivResponse(response.data);
    res.json({ entries });
  } catch (error) {
    console.error('Error fetching data from arXiv:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Parse the XML response from arXiv
function parseArxivResponse(xmlData) {
  const { parseString } = require('xml2js');
  let entries = [];
  parseString(xmlData, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }
    entries = result.feed.entry.map((entry) => ({
      title: entry.title[0],
      id: entry.id[0],
    }));
  });
  return entries;
}

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
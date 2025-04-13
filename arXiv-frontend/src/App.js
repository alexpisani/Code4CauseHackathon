import React, { useState } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/search?query=${searchTerm}`);
      const data = await response.json();
      setResults(data.entries);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Enter a Topic for your StudySession</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term"
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      <ul className="results-list">
        {results.map((entry, index) => (
          <li className="result-item" key={index}>
            <a href={entry.id} target="_blank" rel="noopener noreferrer">
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


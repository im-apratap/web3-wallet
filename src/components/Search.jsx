import React, { useState } from "react";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const Search = () => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [value, { encoding: "jsonParsed" }],
        }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="search-container">
      <h2 className="search-title">Solana Blockchain Explorer</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={value}
          placeholder="Search By Solana's Public Key"
          onChange={(e) => setValue(e.target.value)}
          className="input-search"
        />
        <button className="btn-primary" type="submit">
          Search
        </button>

        {loading && <div>Loading</div>}
        {error && <div>{error}</div>}
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </form>
    </div>
  );
};

export default Search;

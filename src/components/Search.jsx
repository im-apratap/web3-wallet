import React, { useState } from "react";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const Search = ({ onSearchResult }) => {
  const [value, setValue] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    onSearchResult({ loading: true, error: null, result: null });
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
      onSearchResult({ loading: false, result: data, error: null });
    } catch (error) {
      onSearchResult({ loading: false, error: error.message, result: null });
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
      </form>
    </div>
  );
};

export default Search;

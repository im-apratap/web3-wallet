import React, { useState } from "react";

const Search = () => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Solana Blockchain Explorer</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={url}
          placeholder="Search By Solana's Public Key"
          onChange={(e) => setUrl(e.target.value)}
          className="input-search"
        />
        <button className="btn-primary">Search</button>
      </form>
    </div>
  );
};

export default Search;

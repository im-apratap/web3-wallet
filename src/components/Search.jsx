import React, { useState } from "react";
import dotenv from "dotenv";
import { getSolanaBalance } from "../utils/solanaBalance";
import toast from "react-hot-toast";
dotenv.config({ quiet: true });

const Search = ({ onSearchResult }) => {
  const [value, setValue] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    onSearchResult({ loading: true, error: null, result: null });
    try {
      const data = await getSolanaBalance(value);

      if (data.error) {
        toast.error("Invalid Address");
        onSearchResult({
          loading: false,
          error: "Invalid Address",
          result: null,
        });
      } else {
        toast.success("Balance fetched successfully");
        onSearchResult({ loading: false, result: data, error: null });
      }
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

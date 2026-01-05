import React from "react";

const SearchResult = ({ loading, error, result }) => {
  return (
    <div className="result-container">
      {loading && <div>Loading...</div>}

      {error && (
        <div className="error-text" style={{ color: "red" }}>
          {error}
        </div>
      )}

      {result && (
        <pre className="json-output">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};

export default SearchResult;

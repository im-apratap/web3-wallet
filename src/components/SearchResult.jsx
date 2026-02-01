const SearchResult = ({ loading, error, result }) => {
  return (
    <div className="result-container">
      {loading && <p>Loading...</p>}

      {error && <p className="error-text">{error}</p>}

      {result?.result?.value && (
        <div className="wallet-card-balance result-card">
          <div className="balance-display">
            <span className="balance-amount">
              {result.result.value / 1000000000}
            </span>
            <span className="balance-unit">SOL</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;

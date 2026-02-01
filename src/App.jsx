import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;
window.process = window.process || { env: {}, browser: true, version: "" };
window.global = window.global || window;

import { useState } from "react";
import { generateMnemonic, validateMnemonic } from "bip39";
import "./App.css";
import { SolanaWallet } from "./components/SolanaWallet";
// import { EthWallet } from "./components/EthWallet";
import { CopyButton } from "./components/CopyButton";
import Search from "./components/Search";
import SearchResult from "./components/SearchResult";
import toast, {Toaster} from "react-hot-toast"
import { SwapComponent } from "./components/SwapComponent";

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [inputMnemonic, setInputMnemonic] = useState("");
  const [showInput, setShowInput] = useState(false);

  const [searchState, setSearchState] = useState({
    result: null,
    loading: false,
    error: null,
  });

  const handleSearchResult = (newState) => {
    setSearchState((prev) => ({ ...prev, ...newState }));
  };

  const inputSeedPhrase = () => {
    if (validateMnemonic(inputMnemonic.trim())) {
      toast.success("Seed phrase imported successfully");
      setMnemonic(inputMnemonic.trim());
      setShowInput(false);
    } else {
      toast.error("Invalid mnemonic phrase")
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Web3 Vault</h1>
        <p>Securely generate, manage and Search Solana wallets</p>
      </header>
      <Search onSearchResult={handleSearchResult} />
      <SearchResult {...searchState} />
      <SwapComponent />
      <main className="action-section">
        {showInput ? (
          <div style={{ display: "flex", gap: "10px", width: "80%" }} >
            <input
              value={inputMnemonic}
              onChange={(e) => setInputMnemonic(e.target.value)}
              placeholder="Enter Your Existing Seed Phrase"
              className="input-search"
              style={{ border: "1px solid white" }}
            />
            <button onClick={inputSeedPhrase} className="btn-primary">
              Open Wallet
            </button>
          </div>
        ) : (
          <button
            className="btn-primary"
            onClick={() => {
              setShowInput(true);
            }}
          >
            Enter you existing Seed Phrase
          </button>
        )}
        <Toaster/>

        <button
          className="btn-primary"
          onClick={() => setMnemonic(generateMnemonic())}
        >
          {mnemonic ? "Regenerate Mnemonic" : "Create New Seed Phrase"}
        </button>

        {mnemonic && (
          <div className="mnemonic-display">
            {mnemonic.split(" ").map((word, index) => (
              <div className="mnemonic-word" key={index}>
                {word}
              </div>
            ))}
            <CopyButton text={mnemonic} />
          </div>
        )}
      </main>

      {mnemonic && (
        <div className="wallets-section">
          <div className="wallet-header">
            <h2>Solana Wallets</h2>
          </div>
          <SolanaWallet mnemonic={mnemonic} />

          {/* <div className="wallet-header">
            <h2>Ethereum Wallets</h2>
          </div>
          <EthWallet mnemonic={mnemonic} /> */}
        </div>
      )}
    </div>
  );
}

export default App;

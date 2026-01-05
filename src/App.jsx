import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;
window.process = window.process || { env: {}, browser: true, version: "" };
window.global = window.global || window;

import { useState } from "react";
import { generateMnemonic } from "bip39";
import "./App.css";
import { SolanaWallet } from "./components/SolanaWallet";
import { EthWallet } from "./components/EthWallet";
import { CopyButton } from "./components/CopyButton";
import Search from "./components/Search";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <div className="app-container">
      <header className="header">
        <h1>Web3 Vault</h1>
        <p>Securely generate, manage and Search Solana wallets</p>
      </header>
      <Search />
      <main className="action-section">
        <button
          className="btn-primary"
          onClick={() => setMnemonic(generateMnemonic())}
        >
          {mnemonic ? "Regenerate Mnemonic" : "Create Seed Phrase"}
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

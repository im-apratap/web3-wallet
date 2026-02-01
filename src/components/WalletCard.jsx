import { useEffect, useState } from "react";
import { getSolanaBalance } from "../utils/solanaBalance";
import bs58 from "bs58";
import SensitiveText from "./SensitiveText";
import { CopyButton } from "./CopyButton";

const WalletCard = ({ wallet, i }) => {
  const [balance, setBalance] = useState(null);

  const requestBalance = async() => {
    const data = await getSolanaBalance(wallet.publicKey.toBase58())
    setBalance(data.result.value / 1000000000)
  }

  return (
    <div>
      <div className="wallet-card">
        <div className="wallet-info-row">
          <span className="wallet-label">Wallet {i + 1}</span>
        </div>

        <div className="wallet-info-row">
          <span className="wallet-label">Public Key</span>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span className="wallet-value">{wallet.publicKey.toBase58()}</span>
            <CopyButton text={wallet.publicKey.toBase58()} />
          </div>
        </div>

        <div className="wallet-info-row">
          <span className="wallet-label">Private Key</span>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div className="sensitive-container" style={{ flex: 1 }}>
              <SensitiveText text={bs58.encode(wallet.secretKey)} />
            </div>
            <CopyButton text={bs58.encode(wallet.secretKey)} />
          </div>
        </div>

        {balance === null ? (
          <button className="btn-primary" onClick={requestBalance}>
            Check Balance
          </button>
        ) : (
          <div className="wallet-info-row">
            <span className="wallet-label">Balance</span>
            <span className="wallet-value">{balance} SOL</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCard;

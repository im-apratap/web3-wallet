import { useState, useMemo } from "react";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import SensitiveText from "./SensitiveText";
import { CopyButton } from "./CopyButton";
import WalletCard from "./WalletCard";

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);

  const seed = useMemo(() => mnemonicToSeedSync(mnemonic), [mnemonic]);

  function addWallet() {
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    setCurrentIndex(currentIndex + 1);
    setWallets([...wallets, keypair]);
  }

  function resetWallets() {
    setWallets([]);
    setCurrentIndex(0);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          marginBottom: "2rem",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        <button className="btn-primary" onClick={addWallet}>
          Add New Wallet
        </button>

        {wallets.length > 0 && (
          <button onClick={resetWallets} className="btn-primary">
            Reset
          </button>
        )}
      </div>

      {wallets.map((w, i) => (
        <WalletCard key={w.publicKey.toBase58()} wallet={w} i={i}/>
      ))}
    </div>
  );
}

import { useState } from "react";
import { mnemonicToSeedSync } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { CopyButton } from "./CopyButton";
import SensitiveText from "./SensitiveText";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);

  return (
    <div>
      <button
        onClick={function () {
          const seed = mnemonicToSeedSync(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const privateKey = child.privateKey;
          const wallet = new Wallet(privateKey);
          setCurrentIndex(currentIndex + 1);
          setWallets([...wallets, { address: wallet.address, privateKey }]);
        }}
      >
        Add ETH wallet
      </button>

      {wallets.map((w, i) => (
        <div key={w.address} className="wallet-card">
          <div className="wallet-info-row">
            <span className="wallet-label">Wallet {i + 1}</span>
          </div>

          <div className="wallet-info-row">
            <span className="wallet-label">Public Key (Address)</span>
            <span className="wallet-value">{w.address}</span>
            <CopyButton text={w.address} />
          </div>

          <div className="wallet-info-row">
            <span className="wallet-label">Private Key</span>
            <div className="sensitive-container">
              <SensitiveText text={w.privateKey} />
              <CopyButton text={w.privateKey} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

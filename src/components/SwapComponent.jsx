import { useState } from "react";
import { executeSwap } from "../utils/jupiter.js";
import toast from "react-hot-toast";

const POPULAR_TOKENS = [
  { symbol: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
  { symbol: "USDT", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" },
  { symbol: "BONK", mint: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J9v" },
];

export function SwapComponent() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedTokenMint, setSelectedTokenMint] = useState(
    POPULAR_TOKENS[0].mint,
  ); // Default USDC

  // State for provider choice
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const getProvider = (type) => {
    if (type === "Phantom") {
      // Phantom usually sets window.solana.isPhantom
      return window?.solana?.isPhantom ? window.solana : window.phantom?.solana;
    }
    if (type === "Backpack") {
      return window.backpack;
    }
    return window.solana; // Fallback
  };

  const connectWallet = async (type) => {
    try {
      const provider = getProvider(type);

      if (!provider) {
        toast.error(`${type} wallet not found. Please install it.`);
        return;
      }

      // Disconnect first to force a fresh connection prompt if needed
      try {
        await provider.disconnect();
      } catch (e) {
        /* ignore */
      }

      const resp = await provider.connect();
      setWalletAddress(resp.publicKey.toString());

      // Store the active provider type for signing later
      window.activeProviderType = type;

      toast.success(`${type} connected!`);
      setShowWalletOptions(false);
    } catch (err) {
      console.error(err);
      toast.error("User rejected connection");
    }
  };

  const disconnectWallet = () => {
    const type = window.activeProviderType || "Phantom";
    const provider = getProvider(type);
    if (provider) provider.disconnect();
    setWalletAddress(null);
    toast.success("Disconnected");
  };

  const handleSwap = async () => {
    if (!walletAddress) {
      await connectWallet();
      // If still not connected after attempt, stop
      if (!window.solana?.publicKey) return;
    }

    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing swap...");

    try {
      const amountInLamports = amount;
      const type = window.activeProviderType || "Phantom";

      const provider = type === "Backpack" ? window.backpack : window.solana;

      await executeSwap(
        walletAddress,
        amountInLamports,
        provider,
        selectedTokenMint,
      );

      toast.success("Swap processed! Check console for details.", {
        id: toastId,
      });
    } catch (error) {
      console.error("Swap Error:", error);
      toast.error(`Swap failed: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container" style={{ marginTop: "2rem" }}>
      <h2 className="search-title">Exchange SOL to Other Token</h2>

      {!walletAddress ? (
        <div style={{ textAlign: "center" }}>
          {!showWalletOptions ? (
            <button
              className="btn-primary"
              onClick={() => setShowWalletOptions(true)}
            >
              Connect Wallet
            </button>
          ) : (
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                className="btn-primary"
                onClick={() => connectWallet("Phantom")}
              >
                Phantom
              </button>
              <button
                className="btn-primary"
                onClick={() => connectWallet("Backpack")}
              >
                Backpack
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div
            style={{
              marginBottom: "1rem",
              textAlign: "center",
              color: "#aaa",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <span>
              Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              style={{
                background: "transparent",
                border: "1px solid #555",
                color: "#ccc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
                padding: "2px 6px",
              }}
            >
              Disconnect
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: "5px" }}>
              <label style={{ marginRight: "10px", color: "#ccc" }}>
                Receive:
              </label>
              <select
                value={selectedTokenMint}
                onChange={(e) => setSelectedTokenMint(e.target.value)}
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  background: "#333",
                  color: "white",
                  border: "1px solid #555",
                }}
              >
                {POPULAR_TOKENS.map((token) => (
                  <option key={token.symbol} value={token.mint}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                placeholder="Amount (Lamports)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-search"
                style={{ maxWidth: "200px" }}
              />
              <button
                onClick={handleSwap}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Swapping..." : "Swap"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

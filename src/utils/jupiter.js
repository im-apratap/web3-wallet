import { Connection, VersionedTransaction } from "@solana/web3.js";
import { Buffer } from "buffer";

export async function executeSwap(
  walletAddress,
  amountInLamports,
  provider = window.solana,
  outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
) {
  const response = await fetch(
    "https://api.jup.ag/ultra/v1/order?" +
      "inputMint=So11111111111111111111111111111111111111112" + // SOL
      `&outputMint=${outputMint}` + // Dynamic Output
      `&amount=${amountInLamports}` +
      `&taker=${walletAddress}`, // Dynamic taker
    {
      headers: {
        "x-api-key": import.meta.env.VITE_JUPITER_API_KEY,
      },
    },
  );

  console.log("DEBUG: Calling Jupiter URL:", response.url);
  console.log("DEBUG: Taker:", walletAddress);
  console.log("DEBUG: Amount:", amountInLamports);

  const orderResponse = await response.json();

  // Logging
  const SOL_MINT = "So11111111111111111111111111111111111111112";
  const feeToken =
    orderResponse.feeMint === SOL_MINT ? "SOL" : orderResponse.feeMint;
  console.log(`Fee Token -> ${feeToken}`);

  if (orderResponse.transaction) {
    // 1. Deserialize
    const swapTransactionBuf = Buffer.from(orderResponse.transaction, "base64");
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // 2. Provider is already passed as argument 'provider'
    if (!provider) {
      alert("Wallet not found! Please install it.");
      return;
    }

    await provider.connect();

    // 3. Sign
    const signedTransaction = await provider.signTransaction(transaction);

    // 4. Send
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      {
        skipPreflight: true,
        maxRetries: 2,
      },
    );

    console.log(`✅ Swap Sent! Signature: ${txid}`);
    console.log(`View on Solscan: https://solscan.io/tx/${txid}`);
    console.log(`View on Solscan: https://solscan.io/tx/${txid}`);
  } else {
    console.error("No transaction returned from Jupiter:", orderResponse);
    throw new Error(
      "Jupiter did not return a transaction. Check input amount or liquidity.",
    );
  }
}

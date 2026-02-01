export async function getSolanaBalance(publicKey) {
    const response = await fetch(import.meta.env.VITE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [publicKey, { encoding: "jsonParsed" }],
      }),
    });

    return response.json()
}


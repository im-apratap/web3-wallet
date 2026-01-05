import { useState } from "react";

export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy} className="btn-copy">
      {copied ? "✓ Copied" : "📋Copy"}
    </button>
  );
}

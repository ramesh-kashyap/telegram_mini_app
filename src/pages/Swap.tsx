import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type Token = "OFT" | "USDT";

const TOKENS = {
  OFT: {
    symbol: "OFT",
    icon: "/images/logo.png", // put OFT icon here
    balance: 1250,
  },
  USDT: {
    symbol: "USDT",
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040",
    balance: 320,
  },
};

export default function Swap() {
  const [fromToken, setFromToken] = useState<Token>("OFT");
  const [toToken, setToToken] = useState<Token>("USDT");
  const [amount, setAmount] = useState("");

  // mock rate
  const rate = fromToken === "OFT" ? 0.02 : 50;

  const receiveAmount = useMemo(() => {
    if (!amount) return "";
    return (Number(amount) * rate).toFixed(4);
  }, [amount, rate]);

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount("");
  };

  const setMax = () => {
    setAmount(String(TOKENS[fromToken].balance));
  };

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center uppercase">
          Swap
        </h1>

        {/* FROM CARD */}
        <div className="mt-6 p-4 rounded-xl bg-[#1b1b1b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={TOKENS[fromToken].icon}
                className="w-6 h-6"
                alt={fromToken}
              />
              <span className="font-semibold">{fromToken}</span>
            </div>
            <span className="text-sm text-gray-400">
              Balance: {TOKENS[fromToken].balance}
            </span>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent outline-none text-2xl font-bold"
            />
            <button
              onClick={setMax}
              className="px-3 py-1 ml-2 text-sm rounded-md bg-[#27D46C] text-black font-semibold"
            >
              MAX
            </button>
          </div>
        </div>

        {/* SWITCH */}
        <div className="flex justify-center my-5">
          <button
            onClick={switchTokens}
            className="p-3 rounded-full bg-[#27D46C] text-black text-xl font-bold shadow-lg"
          >
            ⇅
          </button>
        </div>

        {/* TO CARD */}
        <div className="p-4 rounded-xl bg-[#1b1b1b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={TOKENS[toToken].icon}
                className="w-6 h-6"
                alt={toToken}
              />
              <span className="font-semibold">{toToken}</span>
            </div>
            <span className="text-sm text-gray-400">
              Balance: {TOKENS[toToken].balance}
            </span>
          </div>

          <div className="mt-4 text-2xl font-bold text-gray-400">
            {receiveAmount || "0.0"}
          </div>
        </div>

        {/* RATE */}
        <div className="mt-4 p-3 text-sm text-center rounded-lg bg-[#1b1b1b] text-gray-400">
          1 {fromToken} ≈ {rate} {toToken}
        </div>

        {/* SWAP BUTTON */}
        <button
          disabled={!amount || Number(amount) <= 0}
          className={cn(
            "mt-6 w-full py-3 rounded-xl font-bold text-black transition-all",
            amount
              ? "bg-[#27D46C]"
              : "bg-gray-500 cursor-not-allowed"
          )}
        >
          Swap {fromToken} → {toToken}
        </button>

        {/* INFO */}
        <div className="mt-6 p-4 bg-[#1b1b1b] rounded-xl text-sm space-y-2">
          <p>• Instant swap execution</p>
          <p>• Rate updates dynamically</p>
          <p>• Minimum swap amount applies</p>
          <p>• Network fees included</p>
        </div>

      </div>
    </div>
  );
}
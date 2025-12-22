import { useState } from "react";
import ListItem from "@/components/ListItem";
import { cn } from "@/lib/utils";
import CheckIcon from "@/components/icons/CheckIcon";

const NETWORKS = [
  {
    key: "BSC",
    label: "BSC (BEP20)",
    img: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=040",
  },
  {
    key: "TRON",
    label: "TRON (TRC20)",
    img: "https://cryptologos.cc/logos/tron-trx-logo.svg?v=040",
  },
];

export default function Withdraw() {
  const [network, setNetwork] = useState<"BSC" | "TRON">("BSC");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  // 🔹 mock balance (replace with API/store later)
  const balance = 250.75; // USDT

  const isValid =
    address.length > 10 &&
    Number(amount) > 0 &&
    Number(amount) <= balance;

  const setMaxAmount = () => {
    setAmount(String(balance));
  };

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center uppercase">
          Withdraw
        </h1>

        {/* Currency */}
        <p className="mt-6 font-medium text-center">Currency</p>
        <div className="mt-4">
          <ListItem
            title="Tether USDT"
            subtitle="Fixed currency"
            image="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040"
            disabled
            action={<CheckIcon className="w-6 h-6 text-[#27D46C]" />}
          />
        </div>

        {/* Balance */}
        <div className="mt-4 text-center text-sm text-gray-400">
          Available Balance:{" "}
          <span className="font-semibold text-white">
            {balance.toLocaleString()} USDT
          </span>
        </div>

        {/* Network */}
        <p className="mt-8 font-medium text-center">Network</p>
        <div className="mt-4 space-y-2">
          {NETWORKS.map((item) => (
            <ListItem
              key={item.key}
              title={item.label}
              image={item.img}
              className={cn(
                network === item.key && "border border-[#27D46C]"
              )}
              action={
                network === item.key ? (
                  <CheckIcon className="w-6 h-6 text-[#27D46C]" />
                ) : undefined
              }
              onClick={() => setNetwork(item.key as "BSC" | "TRON")}
            />
          ))}
        </div>

        {/* Wallet Address */}
        <p className="mt-8 font-medium text-center">Wallet Address</p>
        <div className="mt-4 p-4 bg-[#1b1b1b] rounded-xl">
          <input
            type="text"
            placeholder={`Enter ${network} wallet address`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-transparent outline-none text-sm break-all"
          />
        </div>

        {/* Amount */}
        <p className="mt-6 font-medium text-center">Amount (USDT)</p>
        <div className="mt-4 p-4 bg-[#1b1b1b] rounded-xl flex items-center gap-3">
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xl font-bold"
          />
          <button
            onClick={setMaxAmount}
            className="px-3 py-1 text-sm rounded-md bg-[#27D46C] text-black font-semibold"
          >
            MAX
          </button>
        </div>

        {/* Submit */}
        <button
          disabled={!isValid}
          className={cn(
            "mt-8 w-full py-3 rounded-xl font-bold text-black transition-all",
            isValid
              ? "bg-[#27D46C]"
              : "bg-gray-500 cursor-not-allowed"
          )}
        >
          Withdraw USDT
        </button>

        {/* Withdraw Rules */}
        <p className="mt-8 font-medium text-center">Withdraw Rules</p>
        <div className="mt-4 p-4 bg-[#1b1b1b] rounded-xl text-sm space-y-2">
          <p>• Minimum withdrawal amount applies</p>
          <p>• Withdraw amount must not exceed balance</p>
          <p>• Select correct network ({network})</p>
          <p>• Wrong address or network will result in loss</p>
          <p>• Withdrawals are processed within 24 hours</p>
          <p>• Network fees may apply</p>
        </div>

      </div>
    </div>
  );
}
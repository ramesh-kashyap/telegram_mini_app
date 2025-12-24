import { useState, useMemo } from "react";
import ListItem from "@/components/ListItem";
import { cn } from "@/lib/utils";
import CheckIcon from "@/components/icons/CheckIcon";
import { useQuery, useMutation } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { toast } from "sonner";
import LoadingPage from "@/components/LoadingPage";

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

  /* 🔹 LIVE BALANCE */
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["balances"],
    queryFn: () =>
      $http.$get<{ balances: { USDT: number } }>("/swap/info"),
  });

  const balance = data?.balances.USDT ?? 0;

  /* 🔹 CALCULATIONS */
  const numericAmount = Number(amount) || 0;
  const fee = useMemo(() => numericAmount * 0.1, [numericAmount]);
  const netAmount = useMemo(
    () => Math.max(numericAmount - fee, 0),
    [numericAmount, fee]
  );

  const isValid =
    address.length > 10 &&
    numericAmount >= 5 &&
    numericAmount <= balance;

  /* 🔹 SUBMIT */
  const withdrawMutation = useMutation({
    mutationFn: () =>
      $http.post("/withdraw", {
        network,
        address,
        amount: numericAmount,
      }),
    onSuccess: () => {
      toast.success("Withdrawal request submitted ✅");
      setAmount("");
      setAddress("");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Withdraw failed");
    },
  });

  if (isLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">

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
              onClick={() => setNetwork(item.key as any)}
            />
          ))}
        </div>

        {/* Wallet */}
        <p className="mt-8 font-medium text-center">Wallet Address</p>
        <div className="mt-4 p-4 bg-[#1b1b1b] rounded-xl">
          <input
            type="text"
            placeholder={`Enter ${network} wallet address`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        {/* Amount */}
        <p className="mt-6 font-medium text-center">Amount (USDT)</p>
        <div className="mt-4 p-4 bg-[#1b1b1b] rounded-xl flex items-center gap-3">
          <input
            type="number"
            placeholder="Minimum 5 USDT"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xl font-bold"
          />
          <button
            onClick={() => setAmount(String(balance))}
            className="px-3 py-1 text-sm rounded-md bg-[#27D46C] text-black font-semibold"
          >
            MAX
          </button>
        </div>

        {/* DEDUCTION */}
        {numericAmount > 0 && (
          <div className="mt-4 p-4 bg-[#1b1b1b] rounded-xl text-sm space-y-1">
            <div className="flex justify-between">
              <span>Withdrawal Amount</span>
              <span>{numericAmount} USDT</span>
            </div>
            <div className="flex justify-between text-red-400">
              <span>Fee (10%)</span>
              <span>-{fee.toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between font-bold text-[#27D46C]">
              <span>Net Payable</span>
              <span>{netAmount.toFixed(2)} USDT</span>
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <button
          disabled={!isValid || withdrawMutation.isLoading}
          onClick={() => withdrawMutation.mutate()}
          className={cn(
            "mt-8 w-full py-3 rounded-xl font-bold text-black",
            isValid
              ? "bg-[#27D46C]"
              : "bg-gray-500 cursor-not-allowed"
          )}
        >
          {withdrawMutation.isLoading ? "Processing..." : "Withdraw USDT"}
        </button>

        {/* RULES */}
        <p className="mt-8 font-medium text-center">Withdraw Rules</p>
        <div className="mt-4 p-4 bg-[#1b1b1b] rounded-xl text-sm space-y-2">
          <p>• Minimum withdrawal: 5 USDT</p>
          <p>• 10% withdrawal fee applies</p>
          <p>• Amount must not exceed available balance</p>
          <p>• Select correct network ({network})</p>
          <p>• Wrong address/network may result in loss</p>
          <p>• Withdrawals processed within 24 hours</p>
        </div>

      </div>
    </div>
  );
}
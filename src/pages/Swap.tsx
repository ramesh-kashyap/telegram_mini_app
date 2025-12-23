import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import LoadingPage from "@/components/LoadingPage";
import { toast } from "sonner";

type Token = "OFT" | "USDT";

export default function Swap() {
  const [fromToken, setFromToken] = useState<Token>("OFT");
  const [toToken, setToToken] = useState<Token>("USDT");
  const [amount, setAmount] = useState("");

  /* =======================
     GET BALANCE + PRICE
  ======================= */
  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["swap-info"],
    queryFn: () =>
      $http.$get<{
        balances: { USDT: number; OFT: number };
        price: { OFT_USDT: number; USDT_OFT: number };
      }>("/swap/info"),
  });

  const balances = data?.balances ?? { USDT: 0, OFT: 0 };

  const rate =
    fromToken === "OFT"
      ? data?.price?.OFT_USDT
      : data?.price?.USDT_OFT;

  const receiveAmount = useMemo(() => {
    if (!amount || !rate) return "";
    return (Number(amount) * rate).toFixed(6);
  }, [amount, rate]);

  /* =======================
     SUBMIT SWAP
  ======================= */
  const swapMutation = useMutation({
    mutationFn: () =>
      $http.post("/swap/submit", {
        from: fromToken,
        to: toToken,
        amount: Number(amount),
      }),

    onSuccess: (res: any) => {
      toast.success(res?.message || "Swap completed successfully");
      setAmount("");
      refetch();
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Swap failed. Please try again"
      );
    },
  });

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount("");
  };

  const setMax = () => {
    setAmount(String(balances[fromToken]));
  };

  /* =======================
     LOADER
  ======================= */
  if (isLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">

        <h1 className="text-2xl font-bold text-center uppercase">
          Swap
        </h1>

        {/* FROM */}
        <div className="mt-6 p-4 rounded-xl bg-[#1b1b1b]">
          <div className="flex justify-between">
            <span className="font-semibold">{fromToken}</span>
            <span className="text-sm text-gray-400">
              Balance: {balances[fromToken]}
            </span>
          </div>

          <div className="flex mt-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent outline-none text-2xl font-bold"
            />
            <button
              onClick={setMax}
              className="ml-2 px-3 py-1 rounded-md bg-[#27D46C] text-black font-semibold"
            >
              MAX
            </button>
          </div>
        </div>

        {/* SWITCH */}
        <div className="flex justify-center my-5">
          <button
            onClick={switchTokens}
            className="p-3 rounded-full bg-[#27D46C] text-black text-xl font-bold"
          >
            ⇅
          </button>
        </div>

        {/* TO */}
        <div className="p-4 rounded-xl bg-[#1b1b1b]">
          <div className="flex justify-between">
            <span className="font-semibold">{toToken}</span>
            <span className="text-sm text-gray-400">
              Balance: {balances[toToken]}
            </span>
          </div>

          <div className="mt-4 text-2xl font-bold text-gray-400">
            {receiveAmount || "0.0"}
          </div>
        </div>

        {/* RATE */}
        <div className="mt-4 text-center text-sm text-gray-400">
          1 {fromToken} ≈ {rate} {toToken}
        </div>

        {/* SUBMIT */}
        <button
          disabled={
            swapMutation.isLoading ||
            !amount ||
            Number(amount) <= 0
          }
          onClick={() => swapMutation.mutate()}
          className={cn(
            "mt-6 w-full py-3 rounded-xl font-bold text-black transition-all",
            swapMutation.isLoading || !amount
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#27D46C]"
          )}
        >
          {swapMutation.isLoading ? "Swapping..." : "Swap"}
        </button>

      </div>
    </div>
  );
}
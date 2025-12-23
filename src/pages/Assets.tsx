import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import LoadingPage from "@/components/LoadingPage";

const ICONS = {
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040",
  OFT: "/images/logo.png",
};

export default function Assets() {
  const navigate = useNavigate();

  /** 🔹 ASSETS API (balances + income cards) */
  const { data: assetsRes, isLoading: assetsLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () =>
      $http.$get<{
        balances: {
          USDT: number;
          OFT: number;
        };
        income_cards: {
          daily_roi: number;
          referral_income: number;
          level_income: number;
          salary_income: number;
          reward_income: number;
          total_earned: number;
        };
      }>("/assets"),
  });

  /** 🔹 RECENT HISTORY API (same as before) */
  const { data: historyRes, isLoading: historyLoading } = useQuery({
    queryKey: ["recent-history"],
    queryFn: () =>
      $http.$get<{
        data: {
          id: number;
          type: string;
          amount: number;
          token: string;
          created_at: string;
        }[];
      }>("/history", {
        params: { page: 1, per_page: 6 },
      }),
  });

  if (assetsLoading || historyLoading) return <LoadingPage />;

  const balances = assetsRes?.balances ?? { USDT: 0, OFT: 0 };
  const incomeCards = assetsRes?.income_cards;
  const recentHistory = historyRes?.data ?? [];

  const incomeList = [
    { label: "Daily ROI", value: incomeCards?.daily_roi ?? 0 },
    { label: "Referral Income", value: incomeCards?.referral_income ?? 0 },
    { label: "Level Income", value: incomeCards?.level_income ?? 0 },
    { label: "Salary Income", value: incomeCards?.salary_income ?? 0 },
    { label: "Reward Income", value: incomeCards?.reward_income ?? 0 },
  ];

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center uppercase">
          Assets
        </h1>

        {/* BALANCES */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#1b1b1b] rounded-xl text-center">
            <div className="flex justify-center items-center gap-2">
              <img src={ICONS.USDT} className="w-6 h-6" />
              <p className="text-sm text-gray-400">USDT Balance</p>
            </div>
            <p className="mt-1 text-xl font-bold">
              {balances.USDT.toLocaleString()} USDT
            </p>
          </div>

          <div className="p-4 bg-[#1b1b1b] rounded-xl text-center">
            <div className="flex justify-center items-center gap-2">
              <img src={ICONS.OFT} className="w-6 h-6" />
              <p className="text-sm text-gray-400">OFT Balance</p>
            </div>
            <p className="mt-1 text-xl font-bold">
              {balances.OFT.toLocaleString()} OFT
            </p>
          </div>
        </div>

        {/* DEPOSIT / WITHDRAW */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/deposit")}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-[#27D46C] text-black"
          >
            <img src={ICONS.USDT} className="w-5 h-5" />
            Deposit
          </button>

          <button
            onClick={() => navigate("/withdraw")}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-[#1b1b1b] border border-[#27D46C] text-[#27D46C]"
          >
            <img src={ICONS.USDT} className="w-5 h-5" />
            Withdraw
          </button>
        </div>

        {/* INCOME CARDS */}
        <p className="mt-8 font-medium text-center">
          Earnings Overview
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {incomeList.map((item) => (
            <div
              key={item.label}
              className="p-4 bg-[#1b1b1b] rounded-xl text-center"
            >
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="mt-1 font-bold">
                {item.value.toLocaleString()} OFT
              </p>
            </div>
          ))}

          {/* TOTAL */}
          <div className="col-span-2 p-4 bg-[#27D46C] rounded-xl text-center text-black">
            <p className="text-sm font-semibold">Total Earned</p>
            <p className="mt-1 text-xl font-bold">
              +{incomeCards?.total_earned?.toLocaleString() ?? 0} OFT
            </p>
          </div>
        </div>

        {/* RECENT HISTORY */}
        <p className="mt-8 font-medium text-center">
          Recent History
        </p>

        <div className="mt-4 space-y-2">
          {recentHistory.length === 0 && (
            <p className="text-center text-gray-400">
              No recent history
            </p>
          )}

          {recentHistory.map((item) => {
            const isNegative =
              item.type === "Withdrawal" || item.type === "Buy Package";

            return (
              <div
                key={`${item.type}-${item.id}`}
                className="flex justify-between items-center p-4 bg-[#1b1b1b] rounded-xl"
              >
                <div>
                  <p className="font-medium">{item.type}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString()}{" "}
                    {new Date(item.created_at).toLocaleTimeString()}
                  </p>
                </div>

                <div
                  className={cn(
                    "font-bold",
                    isNegative ? "text-red-500" : "text-green-500"
                  )}
                >
                  {isNegative ? "-" : "+"}
                  {item.amount} {item.token}
                </div>
              </div>
            );
          })}
        </div>

        {/* VIEW ALL */}
        <button
          onClick={() => navigate("/history")}
          className="mt-6 w-full py-3 rounded-xl font-bold bg-[#27D46C] text-black"
        >
          View All History
        </button>

      </div>
    </div>
  );
}
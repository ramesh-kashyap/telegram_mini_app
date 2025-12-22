import { cn } from "@/lib/utils";
import Price from "@/components/Price";
import { useNavigate } from "react-router-dom";

const ICONS = {
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040",
  OFT: "/images/logo.png", // put your OFT icon here
};

export default function Assets() {
  const navigate = useNavigate();

  // mock data (replace later)
  const balances = {
    USDT: 520.75,
    OFT: 14500,
  };

  const incomes = [
    { label: "Daily ROI", amount: 120.5, icon: ICONS.USDT },
    { label: "Referral Income", amount: 85, icon: ICONS.USDT },
    { label: "Level Income", amount: 240, icon: ICONS.USDT },
    { label: "Salary Income", amount: 150, icon: ICONS.USDT },
    { label: "Reward Income", amount: 60, icon: ICONS.USDT },
  ];

  const totalEarned = incomes.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const recentHistory = [
    { title: "Daily ROI", amount: 10, date: "Today", icon: ICONS.USDT },
    { title: "Referral Income", amount: 25, date: "Yesterday", icon: ICONS.USDT },
    { title: "Level Income", amount: 50, date: "2 days ago", icon: ICONS.USDT },
  ];

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center uppercase">
          Assets
        </h1>

        {/* BALANCE */}
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

        {/* DEPOSIT & WITHDRAW */}
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
          {incomes.map((item) => (
            <div
              key={item.label}
              className="p-4 bg-[#1b1b1b] rounded-xl text-center"
            >
              <div className="flex justify-center items-center gap-2">
           
                <p className="text-sm text-gray-400">{item.label}</p>
              </div>
              <p className="mt-1 font-bold">
                    {item.amount.toLocaleString()} OFT
              </p>
            </div>
          ))}

          {/* TOTAL */}
          <div className="col-span-2 p-4 bg-[#27D46C] rounded-xl text-center text-black">
            <div className="flex justify-center items-center gap-2">
              <img src={ICONS.OFT} className="w-5 h-5" />
              <p className="text-sm font-semibold">
                Total Earned
              </p>
            </div>
            <p className="mt-1 text-xl font-bold">
              +{totalEarned.toLocaleString()} OFT
            </p>
          </div>
        </div>

        {/* RECENT HISTORY */}
        <p className="mt-8 font-medium text-center">
          Recent History
        </p>

        <div className="mt-4 space-y-2">
          {recentHistory.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-[#1b1b1b] rounded-xl"
            >
              <div className="flex items-center gap-2">
             
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {item.date}
                  </p>
                </div>
              </div>

              <Price amount={`+${item.amount}`} />
            </div>
          ))}
        </div>

        {/* VIEW ALL */}
        <button
          onClick={() => navigate("/history")}
          className={cn(
            "mt-6 w-full py-3 rounded-xl font-bold",
            "bg-[#27D46C] text-black"
          )}
        >
          View All History
        </button>

      </div>
    </div>
  );
}
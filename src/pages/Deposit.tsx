import { useState, useMemo } from "react";
import ListItem from "@/components/ListItem";
import { cn } from "@/lib/utils";
import CheckIcon from "@/components/icons/CheckIcon";
import { useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import LoadingPage from "@/components/LoadingPage";
import { DepositType } from "@/types/TaskType";

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

export default function Deposit() {
  const [network, setNetwork] = useState<"BSC" | "TRON">("BSC");
const [copied, setCopied] = useState(false);
  const { data: deposit, isLoading } = useQuery({
    queryKey: ["deposit-address", network],
    queryFn: () =>
      $http.$get<DepositType>("/deposit/address", {
        params: { network },
      }),
    staleTime: 1000 * 60 * 5, // cache 5 minutes
  });

  const qrSrc = useMemo(() => {
    if (!deposit?.address) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      deposit.address
    )}`;
  }, [deposit?.address]);


  const copyAddress = () => {
  if (!deposit?.address) return;

  navigator.clipboard.writeText(deposit.address);
  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000); // reset after 2 seconds
};

  if (isLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center uppercase">
          Deposit
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

        {/* Deposit Address */}
        <p className="mt-8 font-medium text-center">Deposit Address</p>

        <div className="flex flex-col items-center mt-4">
          {deposit?.address && (
            <>
              <img
                src={qrSrc}
                alt="Deposit QR"
                className="w-40 h-40 p-2 bg-white rounded-lg"
              />

              <div className="w-full mt-4 p-3 bg-[#1b1b1b] rounded-lg text-center break-all">
                <p className="text-sm">{deposit.address}</p>
              </div>

              <button
                onClick={copyAddress}
                disabled={copied}
                className={cn(
                    "mt-3 px-6 py-2 rounded-lg font-semibold transition-all",
                    copied
                    ? "bg-gray-400 text-black cursor-not-allowed"
                    : "bg-[#27D46C] text-black"
                )}
                >
                {copied ? "Copied ✔" : "Copy Address"}
                </button>
            </>
          )}
        </div>

        {/* Deposit Rules */}
        <p className="mt-8 font-medium text-center">Deposit Rules</p>
        <div className="mt-4 p-4 bg-[#1b1b1b] rounded-lg text-sm space-y-2">
          <p>• Send only USDT ({network})</p>
          <p>• Select correct network</p>
          <p>• Minimum deposit: 25 USDT</p>
          <p>• Deposits are credited automatically</p>
          <p>• Wrong network deposits will be lost</p>
        </div>

      </div>
    </div>
  );
}
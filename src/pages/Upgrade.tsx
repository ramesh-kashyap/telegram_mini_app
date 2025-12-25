import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { $http } from "@/lib/http";
import { cn } from "@/lib/utils";
import LoadingPage from "@/components/LoadingPage";

type PackageType = {
  id: number;
  name: string;
  price: number;
  daily: number;
};

const PACKAGES: PackageType[] = [
  { id: 1, name: "Starter", price: 25, daily: 0.2 },
  { id: 2, name: "Basic", price: 50, daily: 0.3 },
  { id: 3, name: "Standard", price: 100, daily: 0.4 },
  { id: 4, name: "Advanced", price: 200, daily: 0.4 },
  { id: 5, name: "Pro", price: 500, daily: 0.5 },
  { id: 6, name: "Elite", price: 1000, daily: 0.6 },
  { id: 7, name: "VIP", price: 2500, daily: 0.7 },
];

export default function Upgrade() {
  const [selected, setSelected] = useState<PackageType | null>(null);
  const queryClient = useQueryClient();

  /** BALANCE */
  const { data: balanceRes } = useQuery({
    queryKey: ["balances"],
    queryFn: () =>
      $http.$get<{ balances: { USDT: number; OFT: number } }>("/swap/info"),
  });

  const balances = balanceRes?.balances ?? { USDT: 0, OFT: 0 };

  /** PURCHASED PACKAGES */
  const { data: purchasedRes, isLoading: purchasedLoading } = useQuery({
    queryKey: ["my-packages"],
    queryFn: () =>
      $http.$get<{ packages: string[] }>("/packages/my"),
  });


  const purchasedPackages = purchasedRes?.packages ?? [];
  const highestPurchasedPrice = Math.max(
  0,
  ...PACKAGES
    .filter(pkg => purchasedPackages.includes(pkg.name))
    .map(pkg => pkg.price)
);

console.log("Purchased Packages:", purchasedPackages);

  /** BUY MUTATION */
  const buyMutation = useMutation({
    mutationFn: (packageId: number) =>
      $http.post("/packages/buy", { package_id: packageId }),

    onSuccess: () => {
      toast.success("Package purchased successfully 🎉");
      setSelected(null);

      // 🔥 refresh balances & purchased packages
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["my-packages"] });
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Purchase failed");
    },
  });



  if (purchasedLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 px-6 py-8 pb-24 mt-12 modal-body">

        <h1 className="text-2xl font-bold text-center uppercase">
          Upgrade Package
        </h1>

        {/* BALANCE */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b1b1b]">
            <img
              src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040"
              className="w-5 h-5"
            />
            <span className="font-semibold">
              {balances.USDT.toLocaleString()} USDT
            </span>
          </div>
        </div>

        {/* PACKAGES */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {PACKAGES.map((pkg) => {
            const isPurchased = purchasedPackages.includes(pkg.name);
            const isLowerThanCurrent =
  highestPurchasedPrice > 0 && pkg.price < highestPurchasedPrice;

            return (
              <div
                key={pkg.id}
                className="p-4 rounded-xl border transition"
              >
                {/* HEADER */}
                <div className="flex items-center gap-2">
                  <img src="/images/logo.png" className="w-8 h-8" />
                  <p className="font-bold">{pkg.name}</p>
                </div>

                {/* DAILY */}
                <p className="mt-2 text-xs text-gray-400">Daily Output</p>
                <p className="text-sm font-bold text-[#27D46C]">
                  {pkg.daily}% OFT
                </p>

                {/* PRICE */}
                <p className="mt-2 text-xs text-gray-400">Price</p>
                <p className="font-bold">${pkg.price}</p>

                {/* BUTTON */}
               <button
              disabled={isPurchased || isLowerThanCurrent || buyMutation.isPending}
              onClick={() => setSelected(pkg)}
              className={cn(
                "mt-4 w-full py-2 rounded-lg font-bold text-sm",
                isPurchased
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : isLowerThanCurrent
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-[#27D46C] text-black hover:opacity-90"
              )}
            >
              {isPurchased
                ? "Purchased ✔"
                : isLowerThanCurrent
                ? "Not Allowed"
                : "Buy"}
            </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60">
          <div className="w-full rounded-t-2xl bg-[#1b1b1b] p-6">
            <h2 className="text-lg font-bold text-center">
              Confirm Purchase
            </h2>

            <div className="mt-4 p-4 rounded-xl bg-black/40 space-y-2">
              <div className="flex justify-between">
                <span>Package</span>
                <span className="font-bold">{selected.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily ROI</span>
                <span className="text-[#27D46C]">
                  {selected.daily}% OFT
                </span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span>${selected.price}</span>
              </div>
            </div>

            <button
              disabled={buyMutation.isPending}
              onClick={() => buyMutation.mutate(selected.id)}
              className="mt-6 w-full py-3 rounded-xl font-bold bg-[#27D46C] text-black"
            >
              {buyMutation.isPending ? "Processing..." : "Confirm Buy"}
            </button>

            <button
              onClick={() => setSelected(null)}
              className="mt-3 w-full py-3 rounded-xl bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
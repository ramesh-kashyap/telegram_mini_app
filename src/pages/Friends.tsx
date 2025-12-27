import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import CopyIcon from "@/components/icons/CopyIcon";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import LoadingPage from "@/components/LoadingPage";

type LevelStat = {
  level: number;
  total: number;
  valid: number;
};

export default function Friends() {
  const [, copy] = useCopyToClipboard();
  const { telegram_id } = useUserStore();
const navigate = useNavigate();
  /* ======================
     REFERRAL LINK
  ====================== */
  const referralLink = useMemo(
    () => `${import.meta.env.VITE_BOT_URL}/?startapp=ref${telegram_id}`,
    [telegram_id]
  );

  /* ======================
     API (replace later)
  ====================== */
  const { data , isLoading  } = useQuery({
    queryKey: ["team-stats"],
    queryFn: () =>
      $http.$get<{
        total_team: number;
        valid_team: number;
        total_deposit: number;
        total_withdrawal: number;
        levels: LevelStat[];
      }>("/team/stats"),
  });

  const stats = data ?? {
    total_team: 0,
    valid_team: 0,
    total_deposit: 0,
    total_withdrawal: 0,
    levels: Array.from({ length: 25 }).map((_, i) => ({
      level: i + 1,
      total: 0,
      valid: 0,
    })),
  };


   if (isLoading) return <LoadingPage />;
  

  return (
    <div className="flex flex-col bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 px-6 py-8 pb-24 mt-12 modal-body">

        {/* ================= HEADER ================= */}
        <h1 className="text-2xl font-bold text-center uppercase">
          Team & Friends
        </h1>

        {/* ================= SUMMARY CARD ================= */}
        <div className="mt-6 p-5 rounded-2xl bg-[#1b1b1b] border border-white/10 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Team</span>
            <span className="font-bold">
              {stats.valid_team}/{stats.total_team}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Team Deposit</span>
            <span className="font-bold text-green-400">
              ${stats.total_deposit.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Team Withdrawal</span>
            <span className="font-bold text-red-400">
              ${stats.total_withdrawal.toLocaleString()}
            </span>
          </div>
        </div>



        {/* ================= INVITE ================= */}
        <p className="mt-10 text-sm font-bold uppercase text-gray-300">
          Invite Friends
        </p>

        <div className="mt-4 flex gap-3">
          <Button
            className="flex-shrink-0"
            onClick={() => {
              copy(referralLink);
              toast.success("Referral link copied");
            }}
          >
            <CopyIcon className="w-5 h-5" />
          </Button>

          <Button
            className="flex-1"
            onClick={() =>
              Telegram.WebApp.openTelegramLink(
                `https://t.me/share/url?url=${referralLink}`
              )
            }
          >
            Invite via Telegram
          </Button>
        </div>

        {/* ================= LEVEL CARDS ================= */}
        <p className="mt-8 text-sm font-bold uppercase text-gray-300">
          Team Levels
        </p>

        <div className="mt-4 space-y-3">
          {stats.levels
            .filter((lvl) => lvl.total > 0) // 👈 ONLY LEVELS WITH USERS
            .map((lvl) => (
              <div
                key={lvl.level}
                className="rounded-xl px-4 py-3 text-white shadow-md bg-[#1b1b1b]"
              >
                <div className="flex items-center justify-between">

                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    {/* LEVEL BADGE */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 font-bold">
                      L{lvl.level}
                    </div>

                    {/* STATS */}
                    <div>
                      <p className="text-xs opacity-80">
                        Valid / Total Members
                      </p>
                      <p className="text-lg font-bold leading-tight">
                        {lvl.valid} / {lvl.total}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                 <button
              onClick={() => navigate(`/team/level/${lvl.level}`)}
              className="px-3 py-1.5 rounded-full bg-black/30 text-xs font-semibold"
            >
              Details →
            </button>

                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
}
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwapPrevIcon from "@/components/icons/SwapPrevIcon";
import SwapNextIcon from "@/components/icons/SwapNextIcon";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/user-store";
import { compactNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { UserType } from "@/types/UserType";
import levelConfig from "@/config/level-config";
import { uesStore } from "@/store";
import { Loader2Icon } from "lucide-react";

export default function Leaderboard() {
  const { balance, level, id } = useUserStore();
  const { levels } = uesStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperRef | null>(null);

  const leaderboard = useQuery({
    queryKey: ["leaderboard", levels?.[activeIndex]?.id],
    queryFn: () =>
      $http.$get<UserType[]>("/clicker/leaderboard", {
        params: { level_id: levels?.[activeIndex]?.id },
      }),
    enabled: !!levels?.[activeIndex],
  });

  /** Auto move to user level */
  useEffect(() => {
    if (!level || !levels?.length) return;
    const index = levels.findIndex((l) => l.level === level.level);
    if (index !== -1) {
      setActiveIndex(index);
      swiperRef.current?.swiper.slideTo(index, 0);
    }
  }, [levels, level]);

  return (
    <div className="flex flex-col bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 px-6 py-8 pb-24 mt-12 modal-body">

        {/* ================= SLIDER ================= */}
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
            className="rounded-2xl overflow-hidden"
            navigation={{
              nextEl: ".swiper-next",
              prevEl: ".swiper-prev",
            }}
          >
            {levels?.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className="h-[340px] rounded-2xl flex flex-col items-center justify-center text-white"
                  style={{
                    backgroundImage: `url(${levelConfig.bg[item.level]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img
                    src={levelConfig.frogs[item.level]}
                    className="w-52 h-52 object-contain"
                    style={{ filter: levelConfig.filter[item.level] }}
                  />

                  <p className="mt-3 text-xl font-bold">
                    {item.name}
                  </p>
                  <p className="text-sm opacity-80">
                    From {compactNumber(item.from_balance)}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* NAV BUTTONS */}
          <button className="swiper-prev absolute left-2 top-1/2 -translate-y-1/2 z-10">
            <SwapPrevIcon />
          </button>
          <button className="swiper-next absolute right-2 top-1/2 -translate-y-1/2 z-10">
            <SwapNextIcon />
          </button>
        </div>

        {/* ================= PROGRESS ================= */}
        {levels?.[activeIndex]?.level === level?.level && (
          <div className="mt-4">
            <div className="flex justify-between text-sm font-semibold">
              <span>{level.name}</span>
              <span>
                {compactNumber(balance)} / {compactNumber(level.to_balance)}
              </span>
            </div>

            <div className="mt-2 h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FBEDE0] to-[#D36224]"
                style={{
                  width: `${Math.min(
                    100,
                    (balance / level.to_balance) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* ================= LEADERBOARD ================= */}
        <div className="mt-6 flex-1 overflow-y-auto divide-y divide-white/10 rounded-xl bg-black/20">
          {leaderboard.isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : leaderboard.data?.length ? (
            leaderboard.data.map((u, i) => (
              <div
                key={u.id}
                className="flex items-center px-4 py-3 gap-3"
              >
                <span className="w-6 text-primary font-bold">
                  {i + 1}
                </span>

                <span className="flex-1 truncate">
                  {u.first_name} {u.last_name}
                </span>

                <div className="flex items-center gap-1">
                  <img src="/images/coin.png" className="w-4 h-4" />
                  <span className="text-sm">
                    {compactNumber(u.balance)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 opacity-60">
              No data
            </div>
          )}
        </div>

        {/* ================= YOU ROW ================= */}
        {levels?.[activeIndex]?.level === level?.level &&
          !leaderboard.data?.some((u) => u.id === id) && (
            <div className="mt-3 px-4 py-3 bg-[#FFAB5D1A] rounded-xl flex justify-between">
              <span>You</span>
              <span>{compactNumber(balance)}</span>
            </div>
          )}
      </div>
    </div>
  );
}
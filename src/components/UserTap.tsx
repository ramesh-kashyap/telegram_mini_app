import React, { useEffect, useRef, useState } from "react";
import { useClicksStore } from "../store/clicks-store";
import { useUserStore } from "../store/user-store";
import { Link } from "react-router-dom";
import { useDebounce } from "@uidotdev/usehooks";
import { $http } from "@/lib/http";
import levelConfig from "@/config/level-config";
import { toast } from "sonner";

export default function UserTap(props: React.HTMLProps<HTMLDivElement>) {
  const userAnimateRef = useRef<HTMLDivElement | null>(null);
  const userTapButtonRef = useRef<HTMLButtonElement | null>(null);

  const [clicksCount, setClicksCount] = useState(0);
  const debounceClicksCount = useDebounce(clicksCount, 1000);

  /* ======================
     STORES (SELECTORS)
  ====================== */
  const clicks = useClicksStore((s) => s.clicks);
  const addClick = useClicksStore((s) => s.addClick);
  const removeClick = useClicksStore((s) => s.removeClick);

  const UserTapFn = useUserStore((s) => s.UserTap);
  const incraseEnergy = useUserStore((s) => s.incraseEnergy);

  const earn_per_tap = useUserStore((s) => s.earn_per_tap);
  const available_energy = useUserStore((s) => s.available_energy);
  const max_energy = useUserStore((s) => s.max_energy);
  const active_status = useUserStore((s) => s.active_status);
  const level = useUserStore((s) => s.level);

  /* ======================
     TAP HANDLER
  ====================== */
  const tabMe = (e: React.MouseEvent) => {
    e.preventDefault();

    // ❌ NOT ACTIVE
    if (active_status !== "Active") {
      Telegram.WebApp.HapticFeedback.notificationOccurred("error");
      toast.error("Please upgrade a package to start earning");
      return;
    }

    // ❌ NO ENERGY
    if (!UserTapFn()) return;

    setClicksCount((prev) => prev + 1);

    addClick({
      id: Date.now(),
      value: earn_per_tap,
      style: {
        top: e.clientY,
        left: e.clientX + (Math.random() > 0.5 ? 5 : -5),
      },
    });

    animateButton();
  };

  /* ======================
     ANIMATION
  ====================== */
  const animateButton = () => {
    if (!userTapButtonRef.current) return;

    Telegram.WebApp.HapticFeedback.impactOccurred("medium");

    userTapButtonRef.current.classList.add("scale-95");
    setTimeout(() => {
      userTapButtonRef.current?.classList.remove("scale-95");
    }, 150);
  };

  /* ======================
     SEND TAPS TO SERVER
  ====================== */
  useEffect(() => {
    const count = debounceClicksCount;
    if (!count) return;

    setClicksCount(0);

    $http
      .post("/clicker/tap", {
        count,
        energy: available_energy,
        timestamp: Math.floor(Date.now() / 1000),
      })
      .then(({ data }) => {
        if (data.leveled_up) {
          useUserStore.setState({
            level: data.level,
            earn_per_tap: data.earn_per_tap,
            max_energy: data.max_energy,
          });
          toast.success(`Level up! 🎉`);
        }
      })
      .catch(() => {
        setClicksCount(count);
      });
  }, [debounceClicksCount, available_energy]);

  /* ======================
     ENERGY REGEN
  ====================== */
  useEffect(() => {
    useClicksStore.setState({ clicks: [] });

    const interval = setInterval(() => {
      incraseEnergy(3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ======================
     UI
  ====================== */
  return (
    <div {...props}>
      <div className="mt-4 mb-8">
        <button
          ref={userTapButtonRef}
          className="flex items-center justify-center mx-auto transition-all rounded-full outline-none select-none disabled:opacity-80 disabled:cursor-not-allowed"
          disabled={available_energy < earn_per_tap}
          onPointerUp={tabMe}
        >
          <img
            src={levelConfig.frogs[level?.level || 1]}
            alt="level"
            className="object-contain w-80 h-80"
            style={{ filter: levelConfig.filter[level?.level || 1] }}
          />
        </button>
      </div>

      <div ref={userAnimateRef} className="user-tap-animate">
        {clicks.map((click) => (
          <div
            key={click.id}
            onAnimationEnd={() => removeClick(click.id)}
            style={click.style}
          >
            +{click.value}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img src="/images/coin.png" className="w-8 h-8" />
          <span className="text-xs font-bold">
            {available_energy} / {max_energy}
          </span>
        </div>

        <Link to="/boost" className="flex items-center space-x-2 text-sm font-bold">
          <span className="text-xs font-bold">Boost</span>
          <img src="/images/boost.png" className="w-8 h-8" />
        </Link>
      </div>
    </div>
  );
}
"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Bomb, Grid, Droplets, ArrowUp, CircleDashed, Coins, Dice5, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const games = [
  {
    id: "mines",
    title: "Mines",
    provider: "Framble Original",
    edge: "1.00%",
    href: "/mines",
    icon: Bomb,
    iconColor: "text-blue-400",
    glowClass: "bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    id: "keno",
    title: "Keno",
    provider: "Framble Original",
    edge: "1.00%",
    href: "/keno",
    icon: Grid,
    iconColor: "text-emerald-400",
    glowClass: "bg-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/40",
  },
  {
    id: "plinko",
    title: "Plinko",
    provider: "Framble Original",
    edge: "1.00%",
    href: "/plinko",
    icon: Droplets,
    iconColor: "text-orange-400",
    glowClass: "bg-orange-500/10",
    hoverBorder: "hover:border-orange-500/40",
  },
  {
    id: "tower",
    title: "Tower",
    provider: "Framble Original",
    edge: "4.00%",
    href: "/tower",
    icon: ArrowUp,
    iconColor: "text-purple-400",
    glowClass: "bg-purple-500/10",
    hoverBorder: "hover:border-purple-500/40",
  },
  {
    id: "wheel",
    title: "Wheel",
    provider: "Framble Original",
    edge: "4.00%",
    href: "/wheel",
    icon: CircleDashed,
    iconColor: "text-pink-400",
    glowClass: "bg-pink-500/10",
    hoverBorder: "hover:border-pink-500/40",
  },
  {
    id: "coinflip",
    title: "Coin Flip",
    provider: "Framble Original",
    edge: "1.00%",
    href: "/coinflip",
    icon: Coins,
    iconColor: "text-yellow-400",
    glowClass: "bg-yellow-500/10",
    hoverBorder: "hover:border-yellow-500/40",
  },
  {
    id: "dice",
    title: "Dice",
    provider: "Framble Original",
    edge: "1.00%",
    href: "/dice",
    icon: Dice5,
    iconColor: "text-indigo-400",
    glowClass: "bg-indigo-500/10",
    hoverBorder: "hover:border-indigo-500/40",
  },
  {
    id: "crash",
    title: "Crash",
    provider: "Framble Original",
    edge: "1.00%",
    href: "/crash",
    icon: TrendingUp,
    iconColor: "text-blue-500",
    glowClass: "bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/40",
  }
];

export function GameCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-0 mb-6 flex items-center justify-between">
        <h2 className="text-xl sm:text-3xl font-bold tracking-tight uppercase flex items-center gap-3">
          <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
          Originals
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "p-2 rounded-full border transition-colors",
              canScrollLeft 
                ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white" 
                : "bg-slate-900/50 border-slate-800/50 text-slate-600 cursor-not-allowed opacity-50"
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "p-2 rounded-full border transition-colors",
              canScrollRight 
                ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white" 
                : "bg-slate-900/50 border-slate-800/50 text-slate-600 cursor-not-allowed opacity-50"
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="relative w-full pb-6">
        <div 
          className={cn(
            "absolute right-0 top-0 bottom-6 w-12 sm:w-32 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none transition-opacity duration-300",
            canScrollRight ? "opacity-100" : "opacity-0"
          )} 
        />
        <div 
          className={cn(
            "absolute left-0 top-0 bottom-6 w-12 sm:w-32 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )} 
        />        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-4 sm:gap-6 px-4 sm:px-0 max-w-6xl mx-auto scrollbar-hide py-4 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
        {games.map((game) => (
          <Link
            href={game.href}
            key={game.id}
            className={cn(
              "group relative flex-shrink-0 w-32 sm:w-36 md:w-40 rounded-xl flex flex-col overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40",
              game.hoverBorder
            )}
          >
            {/* Top part: Dark background with subtle color glow */}
            <div className="w-full h-28 sm:h-32 flex items-center justify-center relative bg-slate-950/80">
               {/* Subtle background pattern */}
               <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,white_2px,transparent_2px)] [background-size:16px_16px]" />
               
               {/* Soft colored glow behind icon */}
               <div className={cn("absolute w-20 h-20 rounded-full blur-2xl transition-opacity duration-300 opacity-50 group-hover:opacity-100", game.glowClass)} />
               
               <game.icon className={cn("w-10 h-10 sm:w-14 sm:h-14 relative z-10 transition-transform duration-300 group-hover:scale-110", game.iconColor)} />
            </div>
            
            {/* Bottom part: Info */}
            <div className="w-full p-3 sm:p-4 flex flex-col border-t border-slate-800/50 bg-slate-900/80">
              <span className="font-bold text-sm sm:text-base text-slate-100 truncate">{game.title}</span>
              <div className="flex items-center justify-between mt-1.5">
                 <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate hidden sm:block">{game.provider}</span>
                 <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{game.edge}</span>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}

interface WinBannerProps {
  multiplier: number;
  winAmount: number;
}

export function WinBanner({ multiplier, winAmount }: WinBannerProps) {
  return (
    // Прозрачный оверлей с плавной анимацией появления
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
      {/* Карточка: обводка выведена на 80% плотности (border-emerald-400/80), 
          а кольцо вокруг превратилось в полноценный неоновый аура-эффект (ring-2 ring-emerald-400/40) 
          с мощной размытой зеленой тенью (shadow-[0_0_25px_rgba(52,211,153,0.25)]) */}
      <div className="bg-slate-900 border-2 border-emerald-400/80 ring-2 ring-emerald-400/40 p-6 rounded-2xl flex flex-col items-center justify-center text-center max-w-55 w-full relative overflow-hidden">
        {/* Внутреннее фоновое свечение в углу карточки */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Множитель: чистый изумрудно-зеленый градиент без желтизны */}
        <div className="text-4xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 via-green-400 to-green-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(16,185,129,0.35)]">
          {multiplier}x
        </div>

        {/* Разделитель под цвет ультра-яркой обводки */}
        <div className="w-16 h-[2px] bg-emerald-400/80 rounded-full my-3" />

        {/* Сумма выигрыша */}
        <div className="text-2xl font-black text-slate-50 flex items-center gap-0.5 tracking-tight">
          <span className="text-emerald-400 text-xl font-extrabold">$</span>
          {winAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

'use client';

export default function HolidayNavBadge() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/20 to-green-600/20 border border-red-500/30">
      <span className="text-lg animate-bounce-gentle" style={{ animationDuration: '2s' }}>
        🎄
      </span>
      <span className="text-sm font-semibold animate-holiday-shimmer">
        Mutlu Yıllar!
      </span>
      <span className="text-lg animate-bounce-gentle" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
        ✨
      </span>
    </div>
  );
}

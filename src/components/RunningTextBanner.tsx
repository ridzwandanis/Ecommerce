const RunningTextBanner = () => {
  const messages = [
    "Elevated Essentials for Everyday",
    "Designed for Modern Living",
    "Where Style Meets Simplicity",
    "Minimal Looks, Maximum Impact",
    "Timeless Pieces for Every Wardrobe"
  ];

  return (
    <div className="bg-black text-white py-3 overflow-hidden whitespace-nowrap border-y border-zinc-800">
      <div className="inline-block animate-marquee">
        {/* Original set */}
        {messages.map((text, i) => (
          <span key={i} className="mx-8 text-sm md:text-base font-medium tracking-widest uppercase">
            ✦ {text}
          </span>
        ))}
        {/* Duplicated set for seamless loop */}
        {messages.map((text, i) => (
          <span key={`dup-${i}`} className="mx-8 text-sm md:text-base font-medium tracking-widest uppercase">
            ✦ {text}
          </span>
        ))}
      </div>
      
      {/* Inline CSS for the animation since tailwind doesn't have marquee built-in by default */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 40s linear infinite; /* Changed from 20s to 40s */
        }
      `}</style>
    </div>
  );
};

export default RunningTextBanner;
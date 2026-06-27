// No framer-motion — pure CSS animations for performance

export type NeonBgVariant = "A" | "B" | "C" | "D" | "community";

interface Props {
  variant?: NeonBgVariant;
}

const communityLeftInstruments = [
  {
    id: "keyboard-left-1",
    path: "M 20,70 L 180,70 L 180,130 L 20,130 Z M 40,70 L 40,130 M 60,70 L 60,130 M 80,70 L 80,130 M 100,70 L 100,130 M 120,70 L 120,130 M 140,70 L 140,130 M 160,70 L 160,130 M 30,70 L 30,105 L 36,105 L 36,70 M 50,70 L 50,105 L 56,105 L 56,70 M 70,70 L 70,105 L 76,105 L 76,70 M 90,70 L 90,105 L 96,105 L 96,70 M 110,70 L 110,105 L 116,105 L 116,70 M 130,70 L 130,105 L 136,105 L 136,70 M 150,70 L 150,105 L 156,105 L 156,70",
    color: "#9D4EDD", // purple
    style: { top: "12%", left: "2%" },
    rotate: -15
  },
  {
    id: "guitar-left-1",
    path: "M 100,30 C 85,30 80,45 80,55 C 80,70 95,80 95,95 C 95,110 70,120 70,145 C 70,170 85,185 100,185 C 115,185 130,170 130,145 C 130,120 105,110 105,95 C 105,80 120,70 120,55 C 120,45 115,30 100,30 Z M 100,30 L 100,-60 M 95,-60 L 105,-60 M 100,145 A 15,15 0 1,1 100,144",
    color: "#00D4FF", // cyan
    style: { top: "32%", left: "3%" },
    rotate: 25
  },
  {
    id: "soundwave-left-1",
    path: "M 20,100 L 20,110 M 35,100 L 35,120 M 50,100 L 50,140 M 65,100 L 65,160 M 80,100 L 80,180 M 95,100 L 95,190 M 110,100 L 110,170 M 125,100 L 125,145 M 140,100 L 140,125 M 155,100 L 155,115 M 170,100 L 170,105 M 20,100 L 20,90 M 35,100 L 35,80 M 50,100 L 50,60 M 65,100 L 65,40 M 80,100 L 80,20 M 95,100 L 95,10 M 110,100 L 110,30 M 125,100 L 125,55 M 140,100 L 140,75 M 155,100 L 155,85 M 170,100 L 170,95",
    color: "#FF5B00", // orange/pink
    style: { top: "52%", left: "1%" },
    rotate: 0
  },
  {
    id: "electric-guitar-left-1",
    path: "M 100,35 C 85,35 75,50 75,65 C 75,75 85,85 80,95 C 75,105 65,115 65,135 C 65,160 80,180 100,180 C 120,180 135,160 135,135 C 135,115 125,105 120,95 C 115,85 125,75 125,65 C 125,50 115,35 100,35 Z M 100,35 L 100,-50 M 90,65 L 110,65 M 90,75 L 110,75 M 100,135 A 12,12 0 1,1 100,134",
    color: "#9D4EDD", // purple
    style: { top: "72%", left: "3%" },
    rotate: -35
  },
  {
    id: "keyboard-left-2",
    path: "M 20,70 L 180,70 L 180,130 L 20,130 Z M 40,70 L 40,130 M 60,70 L 60,130 M 80,70 L 80,130 M 100,70 L 100,130 M 120,70 L 120,130 M 140,70 L 140,130 M 160,70 L 160,130 M 30,70 L 30,105 L 36,105 L 36,70 M 50,70 L 50,105 L 56,105 L 56,70 M 70,70 L 70,105 L 76,105 L 76,70 M 90,70 L 90,105 L 96,105 L 96,70 M 110,70 L 110,105 L 116,105 L 116,70 M 130,70 L 130,105 L 136,105 L 136,70 M 150,70 L 150,105 L 156,105 L 156,70",
    color: "#00D4FF", // cyan
    style: { top: "88%", left: "2%" },
    rotate: 15
  }
];

const communityRightInstruments = [
  {
    id: "cymbals-right-1",
    path: "M 20,70 C 20,50 180,50 180,70 C 180,90 20,90 20,70 Z M 100,70 L 100,160 M 50,130 C 50,115 150,115 150,130 C 150,145 50,145 50,130 Z M 100,130 L 100,160 M 70,160 L 130,160",
    color: "#00D4FF", // cyan
    style: { top: "8%", right: "2%" },
    rotate: 10
  },
  {
    id: "keyboard-right-1",
    path: "M 20,70 L 180,70 L 180,130 L 20,130 Z M 40,70 L 40,130 M 60,70 L 60,130 M 80,70 L 80,130 M 100,70 L 100,130 M 120,70 L 120,130 M 140,70 L 140,130 M 160,70 L 160,130 M 30,70 L 30,105 L 36,105 L 36,70 M 50,70 L 50,105 L 56,105 L 56,70 M 70,70 L 70,105 L 76,105 L 76,70 M 90,70 L 90,105 L 96,105 L 96,70 M 110,70 L 110,105 L 116,105 L 116,70 M 130,70 L 130,105 L 136,105 L 136,70 M 150,70 L 150,105 L 156,105 L 156,70",
    color: "#FF5B00", // orange/pink
    style: { top: "28%", right: "3%" },
    rotate: -10
  },
  {
    id: "cymbals-right-2",
    path: "M 20,70 C 20,50 180,50 180,70 C 180,90 20,90 20,70 Z M 100,70 L 100,160 M 50,130 C 50,115 150,115 150,130 C 150,145 50,145 50,130 Z M 100,130 L 100,160 M 70,160 L 130,160",
    color: "#9D4EDD", // purple
    style: { top: "48%", right: "2%" },
    rotate: -20
  },
  {
    id: "soundwave-right-1",
    path: "M 20,100 L 20,110 M 35,100 L 35,120 M 50,100 L 50,140 M 65,100 L 65,160 M 80,100 L 80,180 M 95,100 L 95,190 M 110,100 L 110,170 M 125,100 L 125,145 M 140,100 L 140,125 M 155,100 L 155,115 M 170,100 L 170,105 M 20,100 L 20,90 M 35,100 L 35,80 M 50,100 L 50,60 M 65,100 L 65,40 M 80,100 L 80,20 M 95,100 L 95,10 M 110,100 L 110,30 M 125,100 L 125,55 M 140,100 L 140,75 M 155,100 L 155,85 M 170,100 L 170,95",
    color: "#00D4FF", // cyan
    style: { top: "68%", right: "1%" },
    rotate: 0
  },
  {
    id: "guitar-right-1",
    path: "M 100,30 C 85,30 80,45 80,55 C 80,70 95,80 95,95 C 95,110 70,120 70,145 C 70,170 85,185 100,185 C 115,185 130,170 130,145 C 130,120 105,110 105,95 C 105,80 120,70 120,55 C 120,45 115,30 100,30 Z M 100,30 L 100,-60 M 95,-60 L 105,-60 M 100,145 A 15,15 0 1,1 100,144",
    color: "#FF5B00", // orange/pink
    style: { top: "86%", right: "3%" },
    rotate: -25
  }
];

const baseInstruments = [
  {
    id: "guitar" as const,
    path: "M 50,130 C 20,130 20,90 40,70 C 50,60 70,50 90,70 C 110,90 130,80 130,60 C 130,40 160,30 170,50 C 180,70 150,100 130,110 C 110,120 80,130 50,130 Z M 90,70 L 160,0 M 155,-5 L 165,5",
    color: "#FF5B00",
    rotate: -15,
  },
  {
    id: "drums" as const,
    path: "M 100,150 A 40,40 0 1,0 180,150 A 40,40 0 1,0 100,150 M 50,100 A 25,25 0 1,0 100,100 A 25,25 0 1,0 50,100 M 140,80 A 20,5 0 1,0 180,80 A 20,5 0 1,0 140,80 M 160,80 L 160,150 M 75,100 L 75,140",
    color: "#00D4FF",
    rotate: 10,
  },
  {
    id: "keyboard" as const,
    path: "M 30,120 L 170,80 L 150,30 L 10,70 Z M 40,110 L 25,75 M 60,105 L 45,70 M 80,100 L 65,65 M 100,95 L 85,60 M 120,90 L 105,55 M 140,85 L 125,50 M 20,65 L 140,35",
    color: "#9D4EDD",
    rotate: -5,
  },
  {
    id: "headphones" as const,
    path: "M 40,100 C 40,40 160,40 160,100 M 30,100 A 10,20 0 1,0 50,100 A 10,20 0 1,0 30,100 M 150,100 A 10,20 0 1,0 170,100 A 10,20 0 1,0 150,100 M 80,120 A 20,20 0 1,0 120,120 M 90,135 A 10,10 0 1,0 110,135",
    color: "#FFD60A",
    rotate: 20,
  }
];

const variantPositions: Record<Exclude<NeonBgVariant, "community">, { guitar: string, drums: string, keyboard: string, headphones: string }> = {
  A: {
    guitar: "absolute top-[10%] left-0 md:left-[2%] w-[250px] h-[250px] md:w-[350px] md:h-[350px] opacity-40 mix-blend-screen",
    drums: "absolute bottom-[5%] right-0 md:right-[2%] w-[300px] h-[300px] md:w-[350px] md:h-[350px] opacity-40 mix-blend-screen",
    keyboard: "absolute top-[40%] right-0 md:right-[2%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] opacity-30 mix-blend-screen",
    headphones: "absolute bottom-[30%] left-0 md:left-[2%] w-[200px] h-[200px] md:w-[250px] md:h-[250px] opacity-30 mix-blend-screen"
  },
  B: {
    guitar: "absolute bottom-[10%] right-0 md:right-[5%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] opacity-40 mix-blend-screen",
    drums: "absolute top-[5%] left-0 md:left-[5%] w-[250px] h-[250px] md:w-[350px] md:h-[350px] opacity-40 mix-blend-screen",
    keyboard: "absolute bottom-[40%] left-0 md:left-[2%] w-[200px] h-[200px] md:w-[250px] md:h-[250px] opacity-30 mix-blend-screen",
    headphones: "absolute top-[30%] right-0 md:right-[2%] w-[200px] h-[200px] md:w-[250px] md:h-[250px] opacity-30 mix-blend-screen"
  },
  C: {
    guitar: "absolute top-[30%] right-0 md:right-[5%] w-[250px] h-[250px] md:w-[350px] md:h-[350px] opacity-40 mix-blend-screen",
    drums: "absolute bottom-[15%] left-0 md:left-[5%] w-[300px] h-[300px] md:w-[350px] md:h-[350px] opacity-40 mix-blend-screen",
    keyboard: "absolute top-[5%] left-0 md:left-[8%] w-[200px] h-[200px] md:w-[250px] md:h-[250px] opacity-30 mix-blend-screen",
    headphones: "absolute bottom-[5%] right-0 md:right-[10%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] opacity-30 mix-blend-screen"
  },
  D: {
    guitar: "absolute bottom-[20%] left-0 md:left-[2%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] opacity-40 mix-blend-screen",
    drums: "absolute top-[20%] right-0 md:right-[2%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] opacity-40 mix-blend-screen",
    keyboard: "absolute bottom-[10%] right-0 md:right-[15%] w-[200px] h-[200px] md:w-[250px] md:h-[250px] opacity-30 mix-blend-screen",
    headphones: "absolute top-[10%] left-0 md:left-[10%] w-[200px] h-[200px] md:w-[250px] md:h-[250px] opacity-30 mix-blend-screen"
  }
};

export default function NeonInstrumentsBg({ variant = "A" }: Props) {
  if (variant === "community") {
    // Only render 2 instruments each side to save CPU — hidden on non-xl screens
    const leftSubset = communityLeftInstruments.slice(0, 2);
    const rightSubset = communityRightInstruments.slice(0, 2);
    const FLOAT_DURATIONS = ["7s", "9s", "11s", "8s"];

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {leftSubset.map((inst, i) => (
          <div
            key={inst.id}
            className="absolute w-[180px] h-[180px] opacity-25 mix-blend-screen hidden xl:block"
            style={{
              ...inst.style,
              transform: `rotate(${inst.rotate}deg)`,
              animation: `instrumentFloat ${FLOAT_DURATIONS[i]} ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
              <defs>
                <filter id={`glow-comm-l-${inst.id}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d={inst.path}
                fill="transparent"
                stroke={inst.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#glow-comm-l-${inst.id})`}
              />
            </svg>
          </div>
        ))}

        {rightSubset.map((inst, i) => (
          <div
            key={inst.id}
            className="absolute w-[180px] h-[180px] opacity-25 mix-blend-screen hidden xl:block"
            style={{
              ...inst.style,
              transform: `rotate(${inst.rotate}deg)`,
              animation: `instrumentFloatSlow ${FLOAT_DURATIONS[i + 2]} ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
              <defs>
                <filter id={`glow-comm-r-${inst.id}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d={inst.path}
                fill="transparent"
                stroke={inst.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#glow-comm-r-${inst.id})`}
              />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  const layout = variantPositions[variant as Exclude<NeonBgVariant, "community">];
  // Only render 2 instruments per section (guitar + drums) — saves ~50% GPU per section
  const visibleInstruments = baseInstruments.slice(0, 2);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {visibleInstruments.map((inst, i) => (
        <div
          key={inst.id}
          className={layout[inst.id]}
          style={{
            transform: `rotate(${inst.rotate}deg)`,
            animation: `instrumentFloat ${10 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <defs>
              <filter id={`glow-${variant}-${inst.id}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d={inst.path}
              fill="transparent"
              stroke={inst.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${variant}-${inst.id})`}
              opacity="0.9"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}


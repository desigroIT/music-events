"use client";
import { motion } from "framer-motion";

export type NeonBgVariant = "A" | "B" | "C" | "D";

interface Props {
  variant?: NeonBgVariant;
}

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

const variantPositions: Record<NeonBgVariant, { guitar: string, drums: string, keyboard: string, headphones: string }> = {
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
  const layout = variantPositions[variant];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {baseInstruments.map((inst, i) => (
        <motion.div
          key={inst.id}
          className={layout[inst.id]}
          initial={{ y: 0, rotate: inst.rotate }}
          animate={{ 
            y: [0, -30, 0],
            rotate: [inst.rotate, inst.rotate + 5, inst.rotate]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <defs>
              <filter id={`glow-${variant}-${inst.id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d={inst.path}
              fill="transparent"
              stroke={inst.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${variant}-${inst.id})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0, 0],
                opacity: [0, 1, 1, 0, 0]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
                times: [0, 0.4, 0.6, 1]
              }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

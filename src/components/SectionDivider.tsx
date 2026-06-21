"use client";

interface SectionDividerProps {
  leftColor?: string;
  rightColor?: string;
}

export default function SectionDivider({ 
  leftColor = "bg-[#4ade80]", 
  rightColor = "bg-[#3b5bdb]" 
}: SectionDividerProps) {
  return (
    <div className="w-full relative z-20" style={{ height: '0px' }}>
      <div className={`absolute bottom-0 left-0 w-[55%] h-2 ${leftColor}`}></div>
      <div className={`absolute top-0 left-[55%] w-[45%] h-2 ${rightColor}`}></div>
    </div>
  );
}

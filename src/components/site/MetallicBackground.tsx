"use client";

// Fundo decorativo: gradiente metálico sutil + "luzes" flutuantes,
// transmitindo movimento sem pesar na performance (puro CSS/transform).
export default function MetallicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-obsidian">
      <div className="absolute inset-0 bg-metal-gradient opacity-90" />
      <div className="absolute inset-0 bg-chrome-radial" />
      <div className="animate-float absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-white/[0.05] blur-[90px]" />
      <div
        className="animate-float absolute -right-24 top-2/3 h-96 w-96 rounded-full bg-white/[0.04] blur-[110px]"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="animate-float absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full bg-white/[0.03] blur-[100px]"
        style={{ animationDelay: "3s" }}
      />
    </div>
  );
}

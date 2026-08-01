function Card({ score, text }: { score: number; text: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0px,transparent_14px,rgba(255,255,255,0.05)_14px,rgba(255,255,255,0.05)_15px)]" />

      <div className="relative">
        <h3 className="text-4xl font-bold">{score}</h3>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-primary">
          {text}
        </p>
      </div>
    </div>
  );
}

export default Card;

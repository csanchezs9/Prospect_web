export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden py-6 border-y border-[var(--grey)]/20 bg-[var(--bg-warm)]">
      <div className="marquee-track h-display text-5xl md:text-7xl text-[var(--ink)]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            <span>{t}</span>
            <span className="w-3 h-3 rounded-full bg-[var(--orange1)] inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

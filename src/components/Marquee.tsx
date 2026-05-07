export default function Marquee({ items }: { items: string[] }) {
  const renderSet = (key: string) => (
    <div key={key} className="marquee-set" aria-hidden={key === "b" ? true : undefined}>
      {items.map((t, i) => (
        <span key={`${key}-${i}`} className="marquee-item">
          <span>{t}</span>
          <span className="marquee-dot" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden py-6 border-y border-[var(--grey)]/20 bg-[var(--bg-warm)]">
      <div className="marquee-track h-display text-5xl md:text-7xl text-[var(--ink)]">
        {renderSet("a")}
        {renderSet("b")}
      </div>
    </div>
  );
}

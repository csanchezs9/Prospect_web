"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollLine from "./ScrollLine";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const shapes = [
  { src: "/shapes/big-pill-scroll1.png",     style: "top-[10%] left-[-8%] w-[40vw] max-w-[600px]",  d: 250, r: -10, z: 1 },
  { src: "/shapes/big-circle-scroll1.png",   style: "top-[35%] left-[8%] w-[28vw] max-w-[450px]",   d: 380, r: 8,  z: 2 },
  { src: "/shapes/big-hexagon-scroll1.png",  style: "top-[60%] left-[28%] w-[24vw] max-w-[400px]",  d: 320, r: -14, z: 1 },
  { src: "/shapes/big-circle-scroll2.png",   style: "top-[8%] right-[-15%] w-[55vw] max-w-[800px]", d: 480, r: 6,  z: 1 },
  { src: "/shapes/big-circle-scroll3.png",   style: "top-[55%] right-[5%] w-[24vw] max-w-[420px]",  d: 340, r: -8, z: 2 },
  { src: "/shapes/big-square-scroll1.png",   style: "top-[30%] right-[18%] w-[26vw] max-w-[480px]", d: 420, r: 12, z: 1 },
  { src: "/shapes/blue-circle-scroll.svg",   style: "top-[20%] left-[42%] w-12",                    d: 200, r: 0,  z: 3 },
  { src: "/shapes/blue-pill-scroll.svg",     style: "top-[78%] left-[55%] w-20",                    d: 280, r: 25, z: 3 },
  { src: "/shapes/blue-hexagon-scroll.svg",  style: "top-[48%] left-[2%] w-10",                     d: 240, r: 0,  z: 3 },
  { src: "/shapes/blue-circle-scroll.svg",   style: "top-[85%] right-[28%] w-8",                    d: 180, r: 0,  z: 3 },
];

export default function ClickScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cs-shape").forEach((el) => {
        const d = parseFloat(el.dataset.d || "200");
        const r = parseFloat(el.dataset.r || "0");
        gsap.fromTo(
          el,
          { y: d, rotation: -r },
          {
            y: -d,
            rotation: r,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      gsap.from(".cs-headline .word", {
        yPercent: 110,
        stagger: 0.06,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cs-headline", start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const onClick = () => {
    countRef.current += 1;
    setCount(countRef.current);
    const h = hoverRef.current;
    if (!h) return;
    h.innerText = countRef.current === 1 ? "another click!" : `clicks: ${countRef.current}`;
    gsap.fromTo(h, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
  };

  const onEnter = () => {
    const h = hoverRef.current;
    if (!h) return;
    h.innerText = countRef.current === 0 ? "who is curious?" : `clicks: ${countRef.current}`;
    gsap.to(h, { opacity: 1, duration: 0.3, delay: 0.15 });
  };
  const onLeave = () => {
    gsap.to(hoverRef.current, { opacity: 0, duration: 0.3 });
  };

  const headline = "15 years making people click and scroll my designs".split(" ");

  return (
    <section
      ref={ref}
      data-nav="grey"
      className="relative bg-[var(--bg-grey)] min-h-[150vh] overflow-hidden px-6 md:px-10 py-24"
    >
      {/* curved scroll line behind headline — serpentea entre shapes */}
      <ScrollLine
        className="left-1/2 -translate-x-1/2 top-0 w-[60vw] max-w-[700px] h-full z-[2] opacity-70"
        color="var(--orange1)"
        variant="scroll"
        strokeWidth={1.5}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full pt-16">
        <h2 className="cs-headline h-display text-[10vw] md:text-[6.5vw] leading-[1.15] flex flex-col items-center text-center gap-2">
          {headline.map((w, i) => {
            if (w === "click") {
              return (
                <span key={i} className="inline-block overflow-hidden">
                  <span
                    onClick={onClick}
                    onMouseEnter={onEnter}
                    onMouseLeave={onLeave}
                    className="word click-btn"
                  >
                    click
                    <span ref={hoverRef} className="click-hover-text">who is curious?</span>
                  </span>
                </span>
              );
            }
            if (w === "scroll") {
              return (
                <span key={i} className="inline-block overflow-hidden">
                  <span className="word inline-block px-6 py-1 rounded-full border-2 border-[var(--ink)] text-[var(--ink)]">scroll</span>
                </span>
              );
            }
            return (
              <span key={i} className="inline-block overflow-hidden">
                <span className="word inline-block">{w}</span>
              </span>
            );
          })}
        </h2>
      </div>

      {shapes.map((s, i) => (
        <img
          key={i}
          src={s.src}
          alt=""
          className={`cs-shape pointer-events-none absolute ${s.style}`}
          style={{ zIndex: s.z }}
          data-d={s.d}
          data-r={s.r}
        />
      ))}
    </section>
  );
}

"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const text = textRef.current;
    if (!el || !text) return;

    const mouse = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const tick = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.09, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      gsap.set(el, { x: pos.x, y: pos.y });
    };
    gsap.ticker.add(tick);
    window.addEventListener("mousemove", onMove);

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("[data-hover]");
      if (t) {
        el.classList.add("hover");
        text.innerText = t.getAttribute("data-hover-text") || "";
      } else {
        el.classList.remove("hover");
      }
    };
    window.addEventListener("mouseover", onOver);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-jm">
      <img src="/shapes/arrow-grey.svg" alt="" className="cursor-arrow" />
      <span ref={textRef} className="cursor-text" />
    </div>
  );
}

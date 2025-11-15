import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface LinkPillButtonProps {
  label: string;
  href: string;
  baseColor?: string;
  pillColor?: string;
  hoverTextColor?: string;
  className?: string;
}

const LinkPillButton: React.FC<LinkPillButtonProps> = ({
  label,
  href,
  baseColor = "#fff",
  pillColor = "#060010",
  hoverTextColor = "#060010",
  className = "",
}) => {
  const circleRef = useRef<HTMLSpanElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const labelHoverRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const pill = circleRef.current?.parentElement as HTMLElement;
    if (!pill) return;

    const rect = pill.getBoundingClientRect();
    const { width: w, height: h } = rect;
    const R = ((w * w) / 4 + h * h) / (2 * h);
    const D = Math.ceil(2 * R) + 2;
    const delta =
      Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
    const originY = D - delta;

    if (!circleRef.current) return;

    circleRef.current.style.width = `${D}px`;
    circleRef.current.style.height = `${D}px`;
    circleRef.current.style.bottom = `-${delta}px`;

    gsap.set(circleRef.current, {
      xPercent: -50,
      scale: 0,
      transformOrigin: `50% ${originY}px`,
    });

    gsap.set(labelRef.current, { y: 0 });
    gsap.set(labelHoverRef.current, { y: h + 12, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(circleRef.current, {
      scale: 1.2,
      duration: 2,
      ease: "power3.out",
    });

    tl.to(
      labelRef.current,
      { y: -(h + 8), duration: 2, ease: "power3.out" },
      0
    );

    tl.to(
      labelHoverRef.current,
      { y: 0, opacity: 1, duration: 2, ease: "power3.out" },
      0
    );

    tlRef.current = tl;
  }, []);

  const enter = () =>
    tlRef.current?.tweenTo(tlRef.current.duration(), { duration: 0.3 });
  const leave = () => tlRef.current?.tweenTo(0, { duration: 0.2 });

  return (
    <a
      href={href}
      className={`relative overflow-hidden inline-flex items-center justify-center rounded-full font-semibold text-[16px] uppercase px-6 py-2 cursor-pointer no-underline ${className}`}
      style={{
        background: pillColor,
        color: baseColor,
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <span
        ref={circleRef}
        className="absolute left-1/2 bottom-0 rounded-full z-[1]"
        style={{
          background: baseColor,
        }}
      />

      <span className="relative z-[2] inline-block leading-[1]">
        <span ref={labelRef} className="relative inline-block">
          {label}
        </span>
        <span
          ref={labelHoverRef}
          className="absolute left-0 top-0 inline-block"
          style={{ color: hoverTextColor }}
        >
          {label}
        </span>
      </span>
    </a>
  );
};

export default LinkPillButton;

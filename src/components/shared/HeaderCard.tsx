import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface HeaderCardProps {
  title: string;
  subtitle?: string;
  className?: string;
  baseColor?: string;
  hoverColor?: string;
  baseTextColor?: string;
  hoverTextColor?: string;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  title,
  subtitle,
  className = "",
  baseColor = "#060010",
  hoverColor = "#fff",
  baseTextColor = "#fff",
  hoverTextColor = "#060010",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const tl = gsap.timeline({ paused: true });
    tl.to(cardRef.current, {
      backgroundColor: hoverColor,
      color: hoverTextColor,
      scale: 1.05,
      duration: 0.3,
      ease: "power3.out",
    });

    tlRef.current = tl;
  }, [hoverColor, hoverTextColor]);

  const handleMouseEnter = () => tlRef.current?.play();
  const handleMouseLeave = () => tlRef.current?.reverse();

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex flex-col items-center justify-center rounded-full px-6 py-2 font-semibold cursor-pointer select-none transition-colors duration-300 ${className}`}
      style={{ backgroundColor: baseColor, color: baseTextColor }}
    >
      {subtitle && <span className="text-sm">{subtitle}</span>}
      <span className="text-lg">{title}</span>
    </div>
  );
};

export default HeaderCard;

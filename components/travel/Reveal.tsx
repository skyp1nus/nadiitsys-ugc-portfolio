"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import styles from "@/app/travel/travel.module.css";

type Variant = "lift" | "fade" | "default";

interface RevealProps {
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
}

export function Reveal({
  as: Tag = "div",
  variant = "default",
  delay = 0,
  className,
  style,
  children,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantClass =
    variant === "lift" ? styles.revealLift : variant === "fade" ? styles.revealFade : "";
  const merged = [styles.reveal, variantClass, className].filter(Boolean).join(" ");
  const mergedStyle: CSSProperties = {
    ...(style || {}),
    ...(delay
      ? ({ ["--reveal-delay" as never]: `${delay}ms` } as CSSProperties)
      : {}),
  };

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={merged}
      style={mergedStyle}
      data-reveal={shown ? "in" : "out"}
    >
      {children}
    </Tag>
  );
}

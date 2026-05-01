"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import styles from "@/app/beauty/beauty.module.css";

interface RevealProps {
  as?: ElementType;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
}

export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  style,
  children,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delayClass =
    delay === 1 ? styles.delay1 : delay === 2 ? styles.delay2 : delay === 3 ? styles.delay3 : "";
  const merged = [styles.reveal, delayClass, className].filter(Boolean).join(" ");

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={merged}
      style={style}
      data-in={shown ? "true" : "false"}
    >
      {children}
    </Tag>
  );
}

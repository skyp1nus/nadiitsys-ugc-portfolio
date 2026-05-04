"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="uk">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          background: "#0a0a0a",
          color: "#f5f5f5",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          Критична помилка
        </h1>
        <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
          Перезавантажте сторінку.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.6rem 1.2rem",
            border: "1px solid #f5f5f5",
            background: "transparent",
            color: "#f5f5f5",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Повторити
        </button>
      </body>
    </html>
  );
}

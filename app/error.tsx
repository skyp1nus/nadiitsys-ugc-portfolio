"use client";

import { useEffect } from "react";

export default function Error({
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
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Щось пішло не так
      </h1>
      <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
        Спробуйте ще раз або поверніться пізніше.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "0.6rem 1.2rem",
          border: "1px solid currentColor",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Повторити
      </button>
    </main>
  );
}

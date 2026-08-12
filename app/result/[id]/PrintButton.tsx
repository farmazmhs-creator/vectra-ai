"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button className="btn btn-ghost no-print" style={{ padding: "0.5rem 1rem", fontSize: 14 }} onClick={() => window.print()}>
      ⤓ {label}
    </button>
  );
}

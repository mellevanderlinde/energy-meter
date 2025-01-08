import type { ReactNode } from "react";
import { Chart } from "../components/chart";

// biome-ignore lint/style/noDefaultExport: required for Next.js
export default function Home(): ReactNode {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Chart />
      </main>
    </div>
  );
}

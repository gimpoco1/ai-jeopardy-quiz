"use client";
import { useRouter } from "next/navigation";
import { QA } from "../lib/types";
import { useEffect, useState } from "react";

export default function Cell({
  qa,
  category,
  onTransferPoints,
}: {
  qa: QA;
  category: string;
  onTransferPoints: (
    fromId: string | null,
    toId: string,
    points: number
  ) => void;
}) {
  const router = useRouter();
  const [used, setUsed] = useState(false);
  const [usedBy, setUsedBy] = useState<string | null>(null);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("usedQuestions") || "[]");
    const match = list.find(
      (u: any) => u.category === category && u.points === qa.points
    );
    if (match) {
      setUsed(true);
      setUsedBy(match.playerName || null);
    }
  }, [category, qa.points]);

  const handleClick = () => {
    if (used) return;
    localStorage.setItem(
      "currentQuestion",
      JSON.stringify({ ...qa, category })
    );
    router.push("/question");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!used) return;

    const toId = e.dataTransfer.getData("playerId");
    const toName = e.dataTransfer.getData("playerName");
    if (!toId || !toName) return;

    const list = JSON.parse(localStorage.getItem("usedQuestions") || "[]");
    const match = list.find(
      (u: any) => u.category === category && u.points === qa.points
    );
    const fromId: string | null = match?.playerId ?? null;

    if (fromId === toId) return;

    onTransferPoints(fromId, toId, qa.points);

    const updated = list.map((u: any) =>
      u.category === category && u.points === qa.points
        ? { ...u, playerId: toId, playerName: toName }
        : u
    );
    localStorage.setItem("usedQuestions", JSON.stringify(updated));
    setUsedBy(toName);
  };

  return (
    <button
      onClick={handleClick}
      onDragOver={(e) => used && e.preventDefault()}
      onDrop={handleDrop}
      disabled={used}
      className={`flex flex-col items-center justify-center h-20 w-full rounded-xl border shadow-sm 
                transition text-lg font-semibold
      ${
        used
          ? "bg-gray-100 border-gray-300 text-gray-400 line-through"
          : "bg-white border-gray-200  hover:border-bubblegum text-gray-800 hover:border-2"
      }`}
    >
      {used ? (
        <>
          <span>${qa.points}</span>
          {usedBy && (
            <span className="text-xs text-bubblegum mt-1">({usedBy})</span>
          )}
        </>
      ) : (
        <span>${qa.points}</span>
      )}
    </button>
  );
}

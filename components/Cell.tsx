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

  // load used status + owner
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
    if (!used) return; // only assign after question is used

    const toId = e.dataTransfer.getData("playerId");
    const toName = e.dataTransfer.getData("playerName");
    if (!toId || !toName) return;

    const list = JSON.parse(localStorage.getItem("usedQuestions") || "[]");
    const match = list.find(
      (u: any) => u.category === category && u.points === qa.points
    );
    const fromId: string | null = match?.playerId ?? null;

    // same player -> ignore
    if (fromId === toId) return;

    // atomic transfer: -points from previous (if any), +points to new
    onTransferPoints(fromId, toId, qa.points);

    // update owner in storage
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
      className={`flex flex-col items-center justify-center h-20 w-full rounded-md shadow 
                  transition font-extrabold tracking-wide text-center p-1
                  ${
                    used
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gradient-to-br from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-yellow-300 text-2xl"
                  }`}
    >
      {used ? (
        <>
          <span className="line-through opacity-60">${qa.points}</span>
          {usedBy && (
            <span className="text-xs text-white mt-1">({usedBy})</span>
          )}
        </>
      ) : (
        <span>${qa.points}</span>
      )}
    </button>
  );
}

"use client";
import { BoardData, Category } from "../lib/types";
import Cell from "./Cell";

export default function Board({
  data,
  onTransferPoints,
}: {
  data: BoardData;
  onTransferPoints: (
    fromId: string | null,
    toId: string,
    points: number
  ) => void;
}) {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {data.categories.map((cat, idx) => (
          <CategoryColumn
            idx={idx}
            cat={cat}
            onTransferPoints={onTransferPoints}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryColumn({
  cat,
  idx,
  onTransferPoints,
}: {
  cat: Category;
  idx: number;
  onTransferPoints: (
    fromId: string | null,
    toId: string,
    points: number
  ) => void;
}) {
  const colors = [
    "bg-purple-100 border-purple-300 text-purple-800",
    "bg-blue-100 border-blue-300 text-blue-800",
    "bg-emerald-100 border-emerald-300 text-emerald-800",
    "bg-pink-100 border-pink-300 text-pink-800",
    "bg-amber-100 border-amber-300 text-amber-800",
  ];

  const colorClass = colors[idx % colors.length];

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`h-24 flex items-center justify-center text-center 
                    ${colorClass} rounded-xl shadow px-2 font-semibold uppercase tracking-wide`}
      >
        {cat.title}
      </div>

      {cat.questions.map((qa, i) => (
        <Cell
          key={i}
          qa={qa}
          category={cat.title}
          onTransferPoints={onTransferPoints}
        />
      ))}
    </div>
  );
}

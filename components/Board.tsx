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
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {data.categories.map((cat, idx) => (
          <CategoryColumn
            key={idx}
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
  onTransferPoints,
}: {
  cat: Category;
  onTransferPoints: (
    fromId: string | null,
    toId: string,
    points: number
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="h-28 flex items-center justify-center text-center 
                      bg-gradient-to-br from-indigo-600 to-indigo-800 
                      border border-white/20 shadow rounded-md px-2"
      >
        <div className="font-extrabold text-yellow-300 uppercase tracking-wide text-lg text-center">
          {cat.title}
        </div>
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

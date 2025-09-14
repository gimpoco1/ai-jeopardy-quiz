"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BoardData } from "../../lib/types";
import Board from "../../components/Board";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";

type Player = { id: string; name: string; score: number };

export default function QuizPage() {
  const [data, setData] = useState<BoardData | null>(null);

  // ✅ lazy init from localStorage so reloads persist
  const [players, setPlayers] = useState<Player[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("players");
        return raw ? (JSON.parse(raw) as Player[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [newPlayer, setNewPlayer] = useState("");
  const router = useRouter();

  // Load quiz board
  useEffect(() => {
    const raw = localStorage.getItem("quizBoard");
    if (raw) setData(JSON.parse(raw));
    else router.replace("/");
  }, [router]);

  // Persist players
  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  const addPlayer = () => {
    if (!newPlayer.trim()) return;
    const updated = [
      ...players,
      { id: uuid(), name: newPlayer.trim(), score: 0 },
    ];
    setPlayers(updated);
    localStorage.setItem("players", JSON.stringify(updated));
    setNewPlayer("");
  };

  // ✅ atomic transfer: subtract from previous, add to new
  const transferPoints = (
    fromId: string | null,
    toId: string,
    points: number
  ) => {
    setPlayers((prev) => {
      const next = prev.map((p) => {
        if (fromId && p.id === fromId) return { ...p, score: p.score - points };
        if (p.id === toId) return { ...p, score: p.score + points };
        return p;
      });
      localStorage.setItem("players", JSON.stringify(next));
      return next;
    });
  };

  if (!data) return null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-yellow-300">Quiz Time</h1>
        <p className="text-white mt-2 text-xl">
          Topic: <span className="font-semibold text-xl">{data.topic}</span>
        </p>
      </header>

      {/* Board */}
      <Board data={data} onTransferPoints={transferPoints} />

      {/* Players */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">Players</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-3 py-2 rounded-md text-black"
            placeholder="Add player"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
          />
          <button
            onClick={addPlayer}
            className="flex items-center gap-1 px-3 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300"
          >
            <PlusIcon className="h-5 w-5" /> Add
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          {players.map((p) => (
            <div
              key={p.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("playerId", p.id);
                e.dataTransfer.setData("playerName", p.name);
              }}
              className="px-4 py-2 bg-white/20 rounded-lg shadow text-white font-semibold cursor-grab"
            >
              {p.name} <span className="text-yellow-300">${p.score}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reset */}
      <div className="text-center mt-8">
        <button
          onClick={() => {
            localStorage.removeItem("quizBoard");
            localStorage.removeItem("usedQuestions");
            localStorage.removeItem("players");
            router.push("/");
          }}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Start Over
        </button>
      </div>
    </main>
  );
}

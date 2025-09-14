"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BoardData } from "../../lib/types";
import Board from "../../components/Board";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";

type Player = { id: string; name: string; score: number; emoji: string };

export default function QuizPage() {
  const [data, setData] = useState<BoardData | null>(null);

  const [newPlayer, setNewPlayer] = useState("");
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const rawPlayers = localStorage.getItem("players");
    if (rawPlayers) setPlayers(JSON.parse(rawPlayers));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("players", JSON.stringify(players));
    }
  }, [players, loaded]);

  // Load quiz board + players
  useEffect(() => {
    const rawBoard = localStorage.getItem("quizBoard");
    if (rawBoard) setData(JSON.parse(rawBoard));
    else router.replace("/");

    const rawPlayers = localStorage.getItem("players");
    if (rawPlayers) setPlayers(JSON.parse(rawPlayers));
  }, [router]);

  const transferPoints = (
    fromId: string | null,
    toId: string,
    points: number
  ) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (fromId && p.id === fromId) return { ...p, score: p.score - points };
        if (p.id === toId) return { ...p, score: p.score + points };
        return p;
      })
    );
  };

  const resetGame = () => {
    ["quizBoard", "usedQuestions"].forEach((k) => localStorage.removeItem(k));

    // reset players’ scores but keep their names/ids
    const resetPlayers = players.map((p) => ({ ...p, score: 0 }));
    setPlayers(resetPlayers);
    localStorage.setItem("players", JSON.stringify(resetPlayers));

    router.push("/");
  };

  if (!data) return null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 min-h-screen">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">Quiz Time</h1>
      </header>

      {/* Board */}
      <Board data={data} onTransferPoints={transferPoints} />

      {/* Players */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Players</h2>

        <div className="flex flex-wrap gap-3">
          {players.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 px-4 py-2 rounded-full border bg-offwhite text-gray-900 shadow-sm 
                         hover:shadow-md transition transform hover:scale-105 text-sm font-semibold"
            >
              <span className="text-lg">{p.emoji}</span>
              <span>{p.name}</span>
              <span className="ml-2 text-bubblegum font-bold">${p.score}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reset */}
      <div className="text-center mt-12">
        <button
          onClick={resetGame}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Start Over
        </button>
      </div>
    </main>
  );
}

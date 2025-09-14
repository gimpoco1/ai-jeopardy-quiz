"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BoardData } from "../lib/types";
import {
  PlayIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";

type Player = { id: string; name: string; score: number; emoji: string };

export default function Home() {
  const [topic, setTopic] = useState("");
  const [newPlayer, setNewPlayer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [mounted, setMounted] = useState(false);

  // Some playful emojis to assign to players
  const emojis = ["🎲", "🚀", "🦄", "🐉", "⚡", "🎯", "🔥", "🌟"];

  useEffect(() => {
    const raw = localStorage.getItem("players");
    if (raw) setPlayers(JSON.parse(raw));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("players", JSON.stringify(players));
    }
  }, [players, mounted]);

  if (!mounted) return null;

  const addPlayer = () => {
    if (!newPlayer.trim()) return;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    setPlayers((prev) => [
      ...prev,
      { id: uuid(), name: newPlayer.trim(), score: 0, emoji },
    ]);
    setNewPlayer("");
  };

  const handleGenerate = async () => {
    if (!topic.trim() || players.length === 0) {
      setError("Please enter a topic and add at least one player.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      const data: BoardData = json.data;

      localStorage.setItem("quizBoard", JSON.stringify(data));
      router.push("/quiz");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-20">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">AI Quiz Board</h1>
        <p className="mt-2 text-lg text-gray-600">
          Add players, choose a topic, and start your quiz
        </p>
      </header>

      {/* Players Section */}
      <section className="w-full max-w-lg bg-white rounded-2xl shadow-md p-6 mb-10 ">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Players</h2>

        {/* Add Player Input */}
        <input
          className="input w-full mb-6"
          placeholder="Type a name and press Enter"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
        />

        {/* Player List */}
        <div className="flex flex-wrap gap-3">
          {players.map((p) => (
            <div
              key={p.id}
              className="group flex items-center gap-2 px-4 py-2 rounded-full border bg-sky-100 text-gray-900 shadow-sm 
                 hover:shadow-md transition transform hover:scale-105 text-sm font-semibold"
            >
              <span className="text-lg">{p.emoji}</span>
              <span className="flex-1">{p.name}</span>

              {/* Delete button (only on hover) */}
              <button
                onClick={() =>
                  setPlayers((prev) => prev.filter((pl) => pl.id !== p.id))
                }
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          {players.length === 0 && (
            <p className="text-sm text-gray-400 italic">No players added yet</p>
          )}
        </div>
      </section>

      {/* Quiz Setup Section */}
      <section className="w-full max-w-lg bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quiz Setup</h2>

        <input
          className="input w-full mb-6"
          placeholder="Enter topic (e.g., space, cars, history...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />

        <button
          className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-pink-500 to-pink-300 shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <SparklesIcon className="h-6 w-6 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <PlayIcon className="h-6 w-6" />
              Start Playing
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-bubblegum font-medium bg-bubblegum/10 border border-bubblegum rounded-md p-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            {error}
          </div>
        )}
      </section>
    </main>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BoardData } from "../lib/types";
import {
  PlayIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
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
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-yellow-300 drop-shadow-lg">
          AI Quiz Board
        </h1>
      
      </header>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <input
          className="flex-1 rounded-md border border-white/30 bg-black/20 px-3 py-2 shadow-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Enter topic (e.g., space, cars, history...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
        <button
          className="flex items-center justify-center gap-2 rounded-md bg-yellow-400 px-4 py-2 font-semibold text-black shadow hover:bg-yellow-300 transition"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <SparklesIcon className="h-5 w-5 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <PlayIcon className="h-5 w-5" />
              Generate
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 text-red-300 text-center font-medium">
          <ExclamationTriangleIcon className="h-5 w-5" />
          {error}
        </div>
      )}

    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CurrentQ {
  category: string;
  points: number;
  question: string;
  answer?: string;
}
interface Player {
  id: string;
  name: string;
  score: number;
  emoji: string;
}

export default function QuestionPage() {
  const [data, setData] = useState<CurrentQ | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const router = useRouter();

  useEffect(() => {
    const rawQ = localStorage.getItem("currentQuestion");
    if (rawQ) {
      setData(JSON.parse(rawQ));
    } else {
      router.replace("/quiz");
    }

    const rawPlayers = localStorage.getItem("players");
    if (rawPlayers) setPlayers(JSON.parse(rawPlayers));
  }, [router]);

  const markQuestionUsed = () => {
    if (!data) return;
    const used = JSON.parse(localStorage.getItem("usedQuestions") || "[]");

    const alreadyUsed = used.some(
      (u: any) => u.category === data.category && u.points === data.points
    );

    if (!alreadyUsed) {
      used.push({ category: data.category, points: data.points });
      localStorage.setItem("usedQuestions", JSON.stringify(used));
    }
  };

  const awardPoints = (playerId: string | null) => {
    if (!data) return;

    if (playerId) {
      const updated = players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + data.points } : p
      );
      setPlayers(updated);
      localStorage.setItem("players", JSON.stringify(updated));
    }

    // mark question as used and go back
    markQuestionUsed();
    router.push("/quiz");
  };

  if (!data) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 ">
      <div className="w-full max-w-3xl rounded-2xl border border-lavender bg-white shadow-md p-10 text-center">
        {/* Category */}
        <h2 className="text-xl font-semibold uppercase tracking-wide mb-4 text-gray-700">
          {data.category}
        </h2>

        {/* Points */}
        <div className="inline-block px-6 py-2 rounded-full bg-bubblegum/30 text-bubblegum font-bold text-lg mb-8 border border-bubblegum/50">
          ${data.points}
        </div>

        {/* Question */}
        <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-800">
          {data.question}
        </p>

        {/* Reveal Answer */}
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="mt-12 px-6 py-3 rounded-xl border border-sky/90 text-sky font-medium hover:bg-sky/20 transition"
          >
            Show Answer
          </button>
        ) : (
          <>
            <div className="mt-12 text-2xl font-bold text-bubblegum">
              {data.answer}
            </div>

            {/* Award Points */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Who answered correctly?
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {players.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => awardPoints(p.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border bg-offwhite text-gray-900 shadow-sm 
                               hover:shadow-md transition transform hover:scale-105 text-sm font-semibold"
                  >
                    <span className="text-lg">{p.emoji}</span>
                    <span>{p.name}</span>
                  </button>
                ))}

                {/* Default "no one" option */}
                <button
                  onClick={() => awardPoints(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border  text-gray-900 shadow-sm 
                             hover:bg-gray-200 transition text-sm font-medium"
                >
                  🙅 Nobody
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

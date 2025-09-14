"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

interface CurrentQ {
  category: string;
  points: number;
  question: string;
  answer?: string;
}

export default function QuestionPage() {
  const [data, setData] = useState<CurrentQ | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("currentQuestion");
    if (raw) {
      setData(JSON.parse(raw));
    } else {
      router.replace("/quiz");
    }
  }, [router]);

  const markQuestionUsed = () => {
    if (!data) return;

    if (showAnswer) {
      const used = JSON.parse(localStorage.getItem("usedQuestions") || "[]");

      const alreadyUsed = used.some(
        (u: any) => u.category === data.category && u.points === data.points
      );

      if (!alreadyUsed) {
        // ✅ Save without playerName, just mark as used
        used.push({ category: data.category, points: data.points });
        localStorage.setItem("usedQuestions", JSON.stringify(used));
      }
    }

    router.push("/quiz");
  };

  if (!data) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-purple-800 via-pink-600 to-blue-700 text-white">
      <div className="w-full max-w-3xl rounded-3xl border border-white/50 bg-white/30 backdrop-blur-xl p-12 text-center shadow-2xl">
        {/* Category */}
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-6 text-gray-900">
          {data.category}
        </h2>

        {/* Points */}
        <div className="inline-block px-6 py-2 border rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xl  mb-8">
          ${data.points}
        </div>

        {/* Question */}
        <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-900">
          {data.question}
        </p>

        {/* Reveal Answer */}
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="mt-12 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-semibold shadow-lg transition"
          >
            Click here for the answer
          </button>
        ) : (
          <div className="mt-12 text-2xl font-bold ">{data.answer} </div>
        )}
      </div>

      {/* Back to Board */}
      <button
        onClick={markQuestionUsed}
        className="mt-8 flex items-center gap-2 text-white/80 hover:text-white text-sm"
      >
        <ArrowUturnLeftIcon className="h-5 w-5" />
        Back to Board
      </button>
    </main>
  );
}

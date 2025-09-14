"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { Player } from "../../lib/types";

interface CurrentQuestion {
  category: string;
  points: number;
  question: string;
  answer?: string;
}

function capitalizeFirstLetter(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function QuestionPage() {
  const [data, setData] = useState<CurrentQuestion | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAwardSection, setShowAwardSection] = useState(false);
  const router = useRouter();

  const revealAnswer = async () => {
    if (!data) return;
    setLoading(true);
    try {
      const res = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: data.question, topic: data.category }),
      });
      const json = await res.json();
      setAnswer(json.answer);
      setExplanation(json.explanation);
      setTimeout(() => setShowAwardSection(true), 2500);
    } finally {
      setLoading(false);
    }
  };

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
      used.push({
        category: data.category,
        points: data.points,
        playerId: null,
        playerName: null,
      });
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
    markQuestionUsed();
    router.push("/quiz");
  };

  if (!data) return null;

  return (
    <Container>
      <Category>{data.category}</Category>
      <Points>€ {data.points}</Points>

      <Card>
        <Question>{data.question}</Question>

        {!answer ? (
          <RevealButton onClick={revealAnswer} disabled={loading}>
            {loading ? "Loading..." : "Reveal Answer"}
          </RevealButton>
        ) : (
          <>
            <Answer>{capitalizeFirstLetter(answer)}</Answer>
            <Explanation>{explanation}</Explanation>
          </>
        )}
      </Card>

      {showAwardSection && (
        <AwardSection>
          <h3>Who answered correctly?</h3>
          <PlayerList>
            {players.map((p) => (
              <PlayerButton key={p.id} onClick={() => awardPoints(p.id)}>
                <span>{p.emoji}</span>
                <span>{p.name}</span>
              </PlayerButton>
            ))}
            <NobodyButton onClick={() => awardPoints(null)}>
              🙅 Nobody
            </NobodyButton>
          </PlayerList>
        </AwardSection>
      )}
    </Container>
  );
}

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
`;

const Category = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;

const Points = styled.div`
  background: rgba(255, 105, 180, 0.3);
  color: #ff69b4;
  font-weight: 700;
  border: 1px solid rgba(255, 105, 180, 0.5);
  border-radius: 9999px;
  padding: 0.5rem 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  max-width: 48rem;
  width: 100%;
  border-radius: 1rem;
  border: 1px solid #e0e7ff;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  text-align: center;
`;

const Question = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: #1f2937;
`;

const RevealButton = styled.button`
  margin-top: 3rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #0284c7;
  color: #0284c7;
  font-weight: 500;
  transition: background 0.2s ease;
  &:hover {
    background: rgba(2, 132, 199, 0.1);
  }
`;

const Answer = styled.div`
  margin-top: 3rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff69b4;
`;

const Explanation = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  font-style: italic;
`;

const AwardSection = styled.div`
  margin-top: 2rem;
  text-align: center;
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #374151;
  }
`;

const PlayerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`;

const PlayerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NobodyButton = styled(PlayerButton)`
  background: transparent;
  &:hover {
    background: #e5e7eb;
  }
`;

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { BoardData, Player } from "../../lib/types";
import Board from "../../components/Board";
import PlayerButton from "../../components/PlayerButton";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

export default function QuizPage() {
  const [data, setData] = useState<BoardData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

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
        if (fromId && p.id === fromId)
          return { ...p, score: p.score! - points };
        if (p.id === toId) return { ...p, score: p.score! + points };
        return p;
      })
    );
  };

  const resetGame = () => {
    ["quizBoard", "usedQuestions"].forEach((k) => localStorage.removeItem(k));

    const resetPlayers = players.map((p) => ({ ...p, score: 0 }));
    setPlayers(resetPlayers);
    localStorage.setItem("players", JSON.stringify(resetPlayers));

    router.push("/");
  };

  if (!data) return null;

  return (
    <Container>
      <Header>
        <h1>Quiz Time</h1>
      </Header>

      <Board data={data} onTransferPoints={transferPoints} />

      <PlayersSection>
        <h2>Players</h2>
        <PlayerList>
          {players.map((p) => (
            <PlayerButton key={p.id} player={p} showScore />
          ))}
        </PlayerList>
      </PlayersSection>

      <ResetWrapper>
        <button onClick={resetGame}>
          <ArrowPathIcon className="h-5 w-5" />
          Start Over
        </button>
      </ResetWrapper>
    </Container>
  );
}

const Container = styled.main`
  max-width: 72rem;
  margin: 0 auto;
  padding: 3.5rem 1.5rem;
  min-height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;
  h1 {
    font-size: 2.25rem;
    font-weight: 800;
    color: #1f2937;
  }
`;

const PlayersSection = styled.section`
  margin-top: 3rem;
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 1rem;
  }
`;

const PlayerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ResetWrapper = styled.div`
  margin-top: 3rem;
  text-align: center;
  button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
    transition: color 0.2s;
    &:hover {
      color: #374151;
    }
  }
`;

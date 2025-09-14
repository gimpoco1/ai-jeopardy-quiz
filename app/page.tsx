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
import styled from "@emotion/styled";
import PlayerButton from "../components/PlayerButton";

type Player = { id: string; name: string; score: number; emoji: string };

export default function Home() {
  const [topic, setTopic] = useState("");
  const [newPlayer, setNewPlayer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [mounted, setMounted] = useState(false);

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

  const removePlayer = (playerId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    localStorage.setItem("players", JSON.stringify(players));
  };

  return (
    <Container>
      <Header>
        <h1>AI Quiz Board</h1>
        <p>Add players, choose a topic, and start your quiz</p>
      </Header>

      {/* Players Section */}
      <Section>
        <h2>Players</h2>

        <PlayerInput
          placeholder="Type a name and press Enter"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
        />

        <PlayerList>
          {players.map((p) => (
            <PlayerWrapper key={p.id}>
              <PlayerButton player={p} onRemove={() => removePlayer(p.id)} />
            </PlayerWrapper>
          ))}
          {players.length === 0 && <EmptyText>No players added yet</EmptyText>}
        </PlayerList>
      </Section>

      {/* Quiz Setup Section */}
      <Section>
        <h2>Quiz Setup</h2>

        <TopicInput
          placeholder="Enter topic (e.g., space, cars, history...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />

        <StartButton onClick={handleGenerate} disabled={loading}>
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
        </StartButton>

        {error && (
          <ErrorBox>
            <ExclamationTriangleIcon className="h-5 w-5" />
            {error}
          </ErrorBox>
        )}
      </Section>
    </Container>
  );
}

/* ---------------- Emotion styled ---------------- */
const Container = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 1.5rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    font-weight: 800;
    color: #1f2937;
  }
  p {
    margin-top: 0.5rem;
    font-size: 1.125rem;
    color: #4b5563;
  }
`;

const Section = styled.section`
  width: 100%;
  max-width: 32rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  text-align: center;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }
`;

const PlayerInput = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.3);
  }
`;

const PlayerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
`;

const PlayerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DeleteButton = styled.button`
  opacity: 0.7;
  color: #ef4444;
  transition: opacity 0.2s, transform 0.2s;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
`;

const TopicInput = styled(PlayerInput)``;

const StartButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: #fff;
  background: linear-gradient(to right, #ec4899, #f9a8d4);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const ErrorBox = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ec4899;
  background: rgba(236, 72, 153, 0.1);
  border: 1px solid #ec4899;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-weight: 500;
`;

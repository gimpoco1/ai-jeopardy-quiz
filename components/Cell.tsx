"use client";
import { useRouter } from "next/navigation";
import { QA } from "../lib/types";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";

export default function Cell({
  qa,
  category,
  onTransferPoints,
}: {
  qa: QA;
  category: string;
  onTransferPoints: (
    fromId: string | null,
    toId: string,
    points: number
  ) => void;
}) {
  const router = useRouter();
  const [used, setUsed] = useState(false);
  const [usedBy, setUsedBy] = useState<string | null>(null);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("usedQuestions") || "[]");
    const match = list.find(
      (u: any) => u.category === category && u.points === qa.points
    );
    if (match) {
      setUsed(true);
      setUsedBy(match.playerName || null);
    }
  }, [category, qa.points]);

  const handleClick = () => {
    if (used) return;
    localStorage.setItem(
      "currentQuestion",
      JSON.stringify({ ...qa, category })
    );
    router.push("/question");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!used) return;

    const toId = e.dataTransfer.getData("playerId");
    const toName = e.dataTransfer.getData("playerName");
    if (!toId || !toName) return;

    const list = JSON.parse(localStorage.getItem("usedQuestions") || "[]");
    const match = list.find(
      (u: any) => u.category === category && u.points === qa.points
    );
    const fromId: string | null = match?.playerId ?? null;

    if (fromId === toId) return;

    onTransferPoints(fromId, toId, qa.points);

    const updated = list.map((u: any) =>
      u.category === category && u.points === qa.points
        ? { ...u, playerId: toId, playerName: toName }
        : u
    );
    localStorage.setItem("usedQuestions", JSON.stringify(updated));
    setUsedBy(toName);
  };

  return (
    <CellButton
      onClick={handleClick}
      onDragOver={(e) => used && e.preventDefault()}
      onDrop={handleDrop}
      disabled={used}
      used={used}
    >
      {used ? (
        <>
          <span>${qa.points}</span>
          {usedBy && <UsedBy>({usedBy})</UsedBy>}
        </>
      ) : (
        <span>${qa.points}</span>
      )}
    </CellButton>
  );
}


const CellButton = styled.button<{ used: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 5rem;
  width: 100%;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.15s ease;
  border: 1px solid ${({ used }) => (used ? "#d1d5db" : "#e5e7eb")};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background: ${({ used }) => (used ? "#ccced1" : "#fff")};
  color: ${({ used }) => (used ? "#9ca3af" : "#1f2937")};
  text-decoration: ${({ used }) => (used ? "line-through" : "none")};

  &:hover {
    ${({ used }) =>
      !used &&
      `
      border: 2px solid #ec4899;
      color: #1f2937;
    `}
  }
`;

const UsedBy = styled.span`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #ec4899;
`;

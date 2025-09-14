"use client";
import styled from "@emotion/styled";
import { Player } from "../lib/types";
import { TrashIcon } from "@heroicons/react/24/solid";

interface Props {
  player: Player;
  onClick?: () => void;
  onRemove?: () => void;
  showScore?: boolean;
}

export default function PlayerButton({
  player,
  onClick,
  onRemove,
  showScore,
}: Props) {
  return (
    <Wrapper clickable={!!onClick} onClick={onClick}>
      <span className="emoji">{player.emoji}</span>
      <span className="name">{player.name}</span>
      {showScore && <span className="score">${player.score}</span>}

      {onRemove && (
        <DeleteButton
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <TrashIcon className="h-4 w-4" />
        </DeleteButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.button<{ clickable: boolean }>`
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
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};

  .emoji {
    font-size: 1.1rem;
  }

  .score {
    margin-left: 0.5rem;
    color: #ec4899;
    font-weight: 700;
  }

  &:hover {
    ${({ clickable }) =>
      clickable &&
      `
        transform: scale(1.05);
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      `}
  }
`;

const DeleteButton = styled.button`
  margin-left: 0.25rem;
  color: #ef4444;
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

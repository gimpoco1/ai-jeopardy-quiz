"use client";
import { BoardData, Category } from "../lib/types";
import Cell from "./Cell";
import styled from "@emotion/styled";

export default function Board({
  data,
  onTransferPoints,
}: {
  data: BoardData;
  onTransferPoints: (
    fromId: string | null,
    toId: string,
    points: number
  ) => void;
}) {
  return (
    <BoardWrapper>
      <Grid>
        {data.categories.map((cat, idx) => (
          <CategoryColumn
            key={idx}
            idx={idx}
            cat={cat}
            onTransferPoints={onTransferPoints}
          />
        ))}
      </Grid>
    </BoardWrapper>
  );
}

function CategoryColumn({
  cat,
  idx,
  onTransferPoints,
}: {
  cat: Category;
  idx: number;
  onTransferPoints: (
    fromId: string | null,
    toId: string,
    points: number
  ) => void;
}) {
  const colors = [
    { bg: "#EDE9FE", border: "#C4B5FD", text: "#5B21B6" }, // purple
    { bg: "#DBEAFE", border: "#93C5FD", text: "#1E3A8A" }, // blue
    { bg: "#D1FAE5", border: "#6EE7B7", text: "#065F46" }, // emerald
    { bg: "#FCE7F3", border: "#F9A8D4", text: "#9D174D" }, // pink
    { bg: "#FEF3C7", border: "#FCD34D", text: "#92400E" }, // amber
  ];

  const color = colors[idx % colors.length];

  return (
    <Column>
      <CategoryHeader
        style={{
          background: color.bg,
          borderColor: color.border,
          color: color.text,
        }}
      >
        {cat.title}
      </CategoryHeader>

      {cat.questions.map((qa, i) => (
        <Cell
          key={i}
          qa={qa}
          category={cat.title}
          onTransferPoints={onTransferPoints}
        />
      ))}
    </Column>
  );
}


const BoardWrapper = styled.div`
  margin-top: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryHeader = styled.div`
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 0.5rem;
  border: 1px solid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

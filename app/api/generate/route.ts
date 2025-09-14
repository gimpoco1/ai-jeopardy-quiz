import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { SYSTEM_PROMPT, userPrompt } from "../../../lib/prompt";
import { BoardData } from "../../../lib/types";

const BoardSchema = z.object({
  topic: z.string(),
  categories: z
    .array(
      z.object({
        title: z.string().min(2).max(60),
        questions: z
          .array(
            z.object({
              points: z.union([
                z.literal(100),
                z.literal(200),
                z.literal(300),
                z.literal(400),
                z.literal(500),
                z.literal(600),
              ]),
              question: z.string().min(5).max(220),
              answer: z.string().min(1).max(220), // 👈 added
            })
          )
          .length(6),
      })
    )
    .length(5),
});

function mockBoard(topic: string): BoardData {
  const pts = [100, 200, 300, 400, 500, 600] as const;
  const mkCat = (t: string) => ({
    title: t,
    questions: pts.map((p) => ({
      points: p,
      question: `Question for ${p} about ${topic}`,
      answer: ` Answer for ${p} about ${topic}`, // 👈 add answers
    })),
  });
  return {
    topic,
    categories: [
      mkCat(`${topic} Basics`),
      mkCat(`History of ${topic}`),
      mkCat(`${topic} Hardware`),
      mkCat(`Famous in ${topic}`),
      mkCat(`Trends in ${topic}`),
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    const trimmed = String(topic ?? "").trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Fallback to mock if no key
    if (!apiKey) {
      const data = mockBoard(trimmed);
      return NextResponse.json({ data, source: "mock" });
    }

    const client = new OpenAI({ apiKey });
    const resp = await client.chat.completions.create({
      model,
      temperature: 0.8,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(trimmed) },
      ],
      response_format: { type: "json_object" },
    });

    const msg = resp.choices[0].message.content;
    if (!msg) throw new Error("Empty completion");

    // Parse & validate
    const parsed = JSON.parse(msg);
    const validated = BoardSchema.parse(parsed) as BoardData;

    // Sort each category's questions by points (defensive)
    validated.categories.forEach((c) =>
      c.questions.sort((a, b) => a.points - b.points)
    );

    return NextResponse.json({ data: validated, source: "openai" });
  } catch (err: any) {
    console.error("Generate error", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { question, topic } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      return NextResponse.json({
        answer: "Mock answer (no API key)",
        explanation:
          "This is just a placeholder since no API key was provided.",
      });
    }

    const client = new OpenAI({ apiKey });
    const resp = await client.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a trivia assistant. Provide short factual answers and a brief motivation (why this is the answer). Always reply in JSON.",
        },
        {
          role: "user",
          content: `Question: "${question}"\nTopic: "${topic}"\nReturn JSON like:\n{"answer": "concise answer", "explanation": "brief motivation (1–2 sentences)"}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const msg = resp.choices[0].message.content;
    if (!msg) throw new Error("Empty response from model");

    const parsed = JSON.parse(msg);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Answer error", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

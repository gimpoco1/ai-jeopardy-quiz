export const SYSTEM_PROMPT = `You generate quiz boards for a friendly, fast-paced game.
Return STRICT JSON only. NO markdown fences, no commentary.

Rules:
- Create exactly 5 category titles based on the given topic.
- For each category, create exactly 6 questions with point values: 100, 200, 300, 400, 500, 600 (hardness should roughly increase).
- Each question must NOT include an answer yet.
- Questions should be concise, factual, and answerable in a sentence or two.
- Avoid ambiguous or opinion-only prompts.
- Do not repeat categories.
- Keep each question under 180 characters.

JSON schema:
{
  "topic": string,
  "categories": [
    {
      "title": string,
      "questions": [
        {"points": 100, "question": string},
        {"points": 200, "question": string},
        {"points": 300, "question": string},
        {"points": 400, "question": string},
        {"points": 500, "question": string},
        {"points": 600, "question": string}
      ]
    },
    ...
  ]
}`;

export const userPrompt = (topic: string) =>
  `Generate a quiz board based on the theme: "${topic}". 
   Categories and questions should adapt naturally to this theme 
   (e.g., "cars", "pizza", "space exploration", "history of Rome").`;

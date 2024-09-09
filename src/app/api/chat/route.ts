import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4-mini',  // GPT-4-mini 모델 사용
    stream: true,
    messages: messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
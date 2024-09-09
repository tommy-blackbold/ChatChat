import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',  // gpt-4-mini 대신 사용 가능한 모델로 변경
    stream: true,
    messages: messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
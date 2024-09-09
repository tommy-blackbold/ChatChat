import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log('API Key:', process.env.OPENAI_API_KEY); // 환경 변수 로그 추가
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // 모델을 gpt-4o-mini로 설정
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'An error occurred: ' + errorMessage }, { status: 500 });
  }
}
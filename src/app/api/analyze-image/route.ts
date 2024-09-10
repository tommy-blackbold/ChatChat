import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    console.log('Received image URL:', imageUrl);

    if (!imageUrl) {
      return NextResponse.json({ error: '이미지 URL이 없습니다.' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
    }

    const fullImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}${imageUrl}`;
    console.log('Full image URL:', fullImageUrl);

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "이 이미지에 무엇이 있나요?" },
            { type: "image_url", image_url: { url: fullImageUrl } },
          ],
        },
      ],
      max_tokens: 300,
    });

    console.log('OpenAI response:', response.choices[0].message.content);
    return NextResponse.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ 
      error: '이미지 분석 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

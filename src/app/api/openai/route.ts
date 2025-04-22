import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { systemPrompt } from '@/lib/openai/systemPrompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt, previous_response_id } = await req.json();
  const vevctorStoreId = String(process.env.VECTOR_STORE_ID);
  try {
    const response = await openai.responses.create({
      model: 'o4-mini-2025-04-16',
      instructions: systemPrompt,
      input: prompt,
      tools: [{
        type: "file_search",
        vector_store_ids: [vevctorStoreId],
    }],
      previous_response_id: previous_response_id ?? undefined,
    });

    return NextResponse.json({ result: response });
  }
  catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'OpenAI API call failed' }, { status: 500 });
  }
}

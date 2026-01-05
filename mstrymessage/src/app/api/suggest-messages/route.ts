// import { streamText } from 'ai';
// import { openai } from '@ai-sdk/openai';

// export const runtime = 'edge';

// export async function POST() {
//   const prompt =
//     "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'.";

//   const result = await streamText({
//     model: openai('gpt-5.2'), // fast & cheap
//     prompt,
//   });

//   return result.toTextStreamResponse();
// }

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'.";

    const result = await streamText({
      model: openai('gpt-4o-mini'), // or gpt-4o-mini
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error(error);
    return new Response(
      'AI service temporarily unavailable',
      { status: 500 }
    );
  }
}

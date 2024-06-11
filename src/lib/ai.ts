import { OPENAI_KEY } from '$env/static/private';
import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
	apiKey: OPENAI_KEY
});
export const model = openai('gpt-4o');

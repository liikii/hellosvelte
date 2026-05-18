import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const ids: number[] = await request.json();

    const results: Record<string, number> = {};
    
    ids.forEach(id => {
        // 生成 0, 1, 或 2 的随机整数
        results[id] = Math.floor(Math.random() * 3);
    });

    return json(results);
};

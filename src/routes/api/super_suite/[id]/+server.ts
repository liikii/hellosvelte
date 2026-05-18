import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { superSuiteDetailData } from './SuperSuiteDetailData';

// GET: 获取单个 Super Suite 详情
export const GET: RequestHandler = async ({ params }) => {
    const { id } = params; // 从 URL 拿到 ID

    console.log(`正在获取 ID 为 ${id} 的 Super Suite 详情`);

    // 模拟从数据库查询
    const mockDetail = superSuiteDetailData;

    return json(mockDetail);
};

// PUT: 更新该 Super Suite
export const PUT: RequestHandler = async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    
    console.log(`正在更新 ID 为 ${id} 的套件，新数据为:`, body);
    
    return json({ success: true, message: `ID ${id} 已更新` });
};

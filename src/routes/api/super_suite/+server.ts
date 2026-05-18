// src/routes/api/super_suite/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { superSuiteData } from './SuperSuiteData';


export const POST: RequestHandler = async ({ request }) => {
    try {
        // 1. 获取前端传来的数据
        const data = await request.json();

        // 2. 在后端控制台打印数据，方便调试
        console.log('=== 收到 Super Suite 创建请求 ===');
        console.log('名称:', data.name);
        console.log('包含的 Suite IDs:', data.suite_ids);
        console.log('数据详情:', JSON.stringify(data, null, 2));
        console.log('================================');

        // 3. 模拟逻辑处理（如写入数据库）
        // 这里可以直接返回 mock 数据
        return json({
            success: true,
            message: 'Super Suite 创建成功',
            data: {
                id: 'SS_' + Math.random().toString(36).substr(2, 9),
                ...data,
                created_at: new Date().toISOString()
            }
        }, { status: 201 });

    } catch (error) {
        console.error('API Error:', error);
        return json({ 
            success: false, 
            message: '服务器解析数据失败' 
        }, { status: 400 });
    }
};

// 同时也提供一个简单的 GET 接口用于测试
export function GET() {	
    let user_data = superSuiteData;
    return json(user_data);
}

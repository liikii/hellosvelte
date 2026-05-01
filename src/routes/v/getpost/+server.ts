import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// 处理 GET：获取数据
export const GET: RequestHandler = () => {
    return json({ message: "这是 GET 请求返回的数据" });
};

// 处理 POST：接收并处理数据
export const POST: RequestHandler = async ({ request }) => {
    // 解析前端传来的 JSON 身体
    const body = await request.json();
    
    console.log('后端收到的 POST 数据:', body);

    return json({ 
        success: true, 
        received: body,
        message: "POST 请求处理成功！" 
    }, { status: 201 }); // 可以自定义状态码，201 表示已创建
};

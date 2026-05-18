import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { userData } from './UserData';

export function GET() {	
    let user_data = userData;
   	return json(user_data);
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        // 1. 解析前端传来的 JSON 数据
        const newUser = await request.json();

        // 2. 简单的后端校验
        if (!newUser.name || !newUser.mail) {
            return json({ message: '用户名和邮箱不能为空' }, { status: 400 });
        }

        // 3. 执行保存逻辑 (这里演示模拟逻辑，实际应写入数据库)
        console.log('收到新用户数据:', newUser);
        
        // 模拟分配 ID 和创建时间
        const savedUser = {
            ...newUser,
            id: Date.now(),
            create_time: new Date().toISOString()
        };

        // 4. 返回成功响应
        return json({
            message: '用户创建成功',
            user: savedUser
        }, { status: 201 }); // 210 表示 Created

    } catch (error) {
        // 处理 JSON 解析失败或其他意外错误
        return json({ message: '服务器处理请求失败' }, { status: 500 });
    }
};
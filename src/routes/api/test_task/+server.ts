import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { testTaskData } from './TestTaskData';

export function GET() {	
    let test_task_data = testTaskData;
    return json(test_task_data);
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        // 1. 获取前端传来的 JSON 表单数据
        const body = await request.json();

        // 2. 在后端终端打印收到的任务配置，方便你调试流程
        console.log('--- 收到 [创建测试任务] 请求 ---');
        console.log('关联 Super Suite ID:', body.super_suite_id);
        console.log('目标主机 IP:', body.test_host);
        console.log('SSH 登录名:', body.test_host_usr);
        console.log('------------------------------');

        // 3. 模拟数据库保存逻辑
        // 生成一个模拟的任务对象返回给前端，以便 UI 能够即时刷新
        const mockNewTask = {
            id: Math.floor(Math.random() * 10000), // 模拟生成的数据库 ID
            super_suite_name: "新回归测试套件 (Mock)",
            user_name: "admin", 
            test_host: body.test_host,
            test_host_usr: body.test_host_usr,
            create_time: new Date().toISOString(),
            status_code: 0, // 默认初始状态为：未运行
            celery_id: crypto.randomUUID() // 模拟异步队列 ID
        };

        // 4. 返回 201 Created 状态码
        return json({
            success: true,
            message: '测试任务已成功进入队列',
            data: mockNewTask
        }, { status: 201 });

    } catch (error) {
        console.error('API 错误:', error);
        return json({
            success: false,
            message: '提交的数据格式不正确'
        }, { status: 400 });
    }
};

// 如果你之后需要获取“任务列表”，也可以在这个文件里写 GET 方法

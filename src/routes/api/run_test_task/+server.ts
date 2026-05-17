import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        // 1. 解析前端传过来的 JSON 请求体
        const body = await request.json();
        const { test_task_id } = body;

        // 2. 模拟参数校验（类似后端的 Pydantic）
        if (test_task_id === undefined || test_task_id === null) {
            return json({
                code: 400,
                msg: '参数校验失败：缺少必填字段 test_task_id',
                data: null
            }, { status: 400 });
        }

        // 3. 随机决定成功还是失败 (50% 概率)
        const isSuccess = Math.random() > 0.5;

        if (isSuccess) {
            console.log(`测试任务 [ID: ${test_task_id}] 启动成功，正在后台下发执行...`);
            return json({
                code: 200,
                msg: `测试任务 [ID: ${test_task_id}] 启动成功，正在后台下发执行...`,
                data: {
                    task_id: test_task_id,
                    status: 'running'
                }
            }, { status: 200 });
        } else {
            console.log(`测试任务 [ID: ${test_task_id}] 启动失败：执行机节点响应超时，请检查后重试。`);
            return json({
                code: 400,
                msg: `测试任务 [ID: ${test_task_id}] 启动失败：执行机节点响应超时，请检查后重试。`,
                data: null
            }, { status: 400 });
        }

    } catch (error) {
        return json({
            code: 400,
            msg: '请求体解析错误，请确保发送的是标准的 JSON 数据。',
            data: null
        }, { status: 400 });
    }
};

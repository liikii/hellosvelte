import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { testTaskDetailData } from './TestTaskDetail';


export function GET() {	
    let test_task_data = testTaskDetailData;
    return json(test_task_data);
}


export const PUT: RequestHandler = async ({ params, request }) => {
    const { id } = params; // 从 URL 路径中获取 [id]
    const body = await request.json();
    const { test_host, test_host_usr, test_host_pwd } = body;

    // 模拟 800 毫秒数据库保存延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!id) {
        return json({ success: false, message: '保存失败：URL 缺少任务 ID' }, { status: 400 });
    }

    console.log(`[Mock DB Update] 任务 ID: ${id}`, { test_host, test_host_usr });

    return json({
        success: true,
        message: `任务 ${id} 的主机配置已成功更新！`
    });
};

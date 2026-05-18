import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const { test_host, test_host_usr, test_host_pwd } = await request.json();

    // 模拟网络延迟 1 秒
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 简单写一段 Mock 校验逻辑
    if (!test_host || !test_host_usr || !test_host_pwd) {
        return json({ success: false, message: '连接失败：配置信息填写不完整' }, { status: 400 });
    }

    if (test_host === '127.0.0.1' || test_host_pwd === 'wrong') {
        return json({ success: false, message: `连接目标 ${test_host} 失败：认证拒绝或超时。` });
    }

    return json({
        success: true,
        message: `成功连接至 Host [${test_host_usr}@${test_host}]！网络畅通。`
    });
};

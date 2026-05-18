import { json, type RequestHandler } from '@sveltejs/kit';
import { OTP, verify } from 'otplib';

// 初始化标准的 TOTP 实例
const totp = new OTP({ strategy: 'totp' });

/**
 * 导入绑定阶段的临时内存存储（确保跨文件可以共享，这里视您之前导出的方式而定）
 * 如果您在 /api/totp/+server.js 中加入了 export const tempStorage = ...，这里可以直接导入。
 * 为了演示闭环，我们在此处定义一个兜底逻辑。
 */
import { tempStorage } from '../totpStore.ts';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { username, token } = await request.json();

        if (!username || !token) {
            return json({ success: false, message: '参数不完整' }, { status: 400 });
        }

        // ================= 【 生产环境核心业务逻辑 】 =================
        // 请在此处替换为您的真实数据库查询，示例（以 Prisma 为例）：
        // const user = await db.user.findUnique({ where: { username } });
        // if (!user || !user.totpSecret) { ... }
        // const savedSecret = user.totpSecret;
        // ==========================================================

        // 【本地开发 Mock 测试】直接读取之前绑定成功或临时存放的密钥
        const record = tempStorage.get(username);
        const savedSecret = record ? record.secret : null;

        if (!savedSecret) {
            return json(
                { success: false, message: '该账户未开启双重验证，请先在左侧完成绑定' }, 
                { status: 404 }
            );
        }

        // 调用标准函数进行动态验证
        const result = await verify({
            secret: savedSecret,
            token: token,
            window: 1 // 允许用户手机与服务器之间有 ±30 秒的误差
        });

        if (result.valid) {
            // TODO: 此处为用户颁发 Session、Cookie 或 JWT Token
            return json({ success: true, message: '身份验证成功，欢迎回来！' });
        } else {
            return json({ success: false, message: '验证码错误或已过期' }, { status: 401 });
        }

    } catch (error) {
        return json({ success: false, message: '服务器内部校验出错' }, { status: 500 });
    }
};

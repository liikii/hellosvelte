import { json } from '@sveltejs/kit';
// 1. 修改导入方式：新版 otplib 推荐引入 OTP 类和标准的生成函数
import { OTP, generateSecret, verify } from 'otplib'; 
import QRCode from 'qrcode';

// export const tempStorage = new Map();
import { tempStorage } from '../totpStore.ts'; 

const APP_NAME = 'MyAwesomeApp';

// 2. 初始化一个标准的 TOTP 实例
const totp = new OTP({ strategy: 'totp' });

/**
 * 步骤 1：生成密钥并直接转换成 Base64 二维码图片
 */
export async function GET({ url }) {
    const username = url.searchParams.get('username') || 'user@example.com';

    // 使用官方标准的 generateSecret() 函数生成 Base32 共享密钥
    const secret = generateSecret();
    
    // 使用新版实例自带的 generateURI 方法构建标准的 otpauth:// URI
    const otpauthUri = totp.generateURI({
        secret,
        label: username,
        issuer: APP_NAME
    });

    tempStorage.set(username, { secret, createdAt: Date.now() });

    try {
        const qrCodeBase64 = await QRCode.toDataURL(otpauthUri, {
            width: 200,
            margin: 2
        });

        return json({ qrCodeBase64, username });
    } catch (err) {
        return json({ success: false, message: '二维码生成失败' }, { status: 500 });
    }
}

/**
 * 步骤 2：接收 6 位验证码并验证
 */
export async function POST({ request }) {
    const { username, token } = await request.json();

    if (!username || !token) {
        return json({ success: false, message: '参数不完整' }, { status: 400 });
    }

    const record = tempStorage.get(username);
    if (!record) {
        return json({ success: false, message: '验证超时，请刷新重试' }, { status: 400 });
    }

    try {
        // 使用新版官方推荐的异步异步 verify 校验函数，更加安全高效
        const result = await verify({
            secret: record.secret,
            token: token,
            window: 1 // 允许 ±30 秒的时间步长容错
        });

        // 校验结果存储在 result.valid 中
        if (result.valid) {
            // 校验成功，执行数据库入库逻辑...
            // tempStorage.delete(username);
            return json({ success: true, message: '安全绑定成功！' });
        } else {
            return json({ success: false, message: '验证码错误，请重新输入' }, { status: 400 });
        }
    } catch (error) {
        return json({ success: false, message: '校验过程出错' }, { status: 500 });
    }
}

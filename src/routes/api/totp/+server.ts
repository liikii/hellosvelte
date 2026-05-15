import { json } from '@sveltejs/kit';
import { authenticator } from 'otplib';
import QRCode from 'qrcode'; // 引入二维码生成库

// npm install qrcode
// npm install otplib


// 临时存储未激活的 secret（生产环境请存入数据库临时表、Redis 或 Session）
const tempStorage = new Map();
const APP_NAME = 'MyAwesomeApp';

/**
 * 步骤 1：生成密钥并直接转换成 Base64 二维码图片
 */
export async function GET({ url }) {
    const username = url.searchParams.get('username') || 'user@example.com';

    // 1. 生成共享密钥与标准 URI
    const secret = authenticator.generateSecret();
    const otpauthUri = authenticator.keyuri(username, APP_NAME, secret);

    // 2. 将未激活的密钥临时存起来，等待验证
    tempStorage.set(username, { secret, createdAt: Date.now() });

    try {
        // 3. 【核心】在后端直接将 URI 转化为 Base64 图片字符串
        // 返回格式类似于 "data:image/png;base64,iVBORw0KGgoAAAANSUh..."
        const qrCodeBase64 = await QRCode.toDataURL(otpauthUri, {
            width: 200,
            margin: 2
        });

        // 4. 只返回 Base64 图片，secret 和 uri 彻底被隐藏在后端
        return json({ qrCodeBase64, username });
    } catch (err) {
        return json({ success: false, message: '二维码生成失败' }, { status: 500 });
    }
}

/**
 * 步骤 2：接收 6 位验证码并验证（保持不变）
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

    // 校验用户输入的 6 位验证码
    const isValid = authenticator.check(token, record.secret);

    if (isValid) {
        // 校验成功，在此处编写数据库入库逻辑...
        tempStorage.delete(username);
        return json({ success: true, message: '安全绑定成功！' });
    } else {
        return json({ success: false, message: '验证码错误，请重新输入' }, { status: 400 });
    }
}

import { json, type RequestHandler } from '@sveltejs/kit';
import svgCaptcha from 'svg-captcha';

export const GET: RequestHandler = async () => {
    try {
        // 1. 创建验证码文本和 SVG
        // 建议宽度 120，高度 38（与 Bootstrap 默认输入框高度一致）
        const captcha = svgCaptcha.create({
            size: 4,           // 验证码长度为 4 位
            ignoreChars: '0o1iIL', // 排除容易混淆的相似字符
            noise: 2,          // 干扰线条的数量
            color: true,       // 验证码字符是否有颜色
            background: '#ffffff', // 验证码背景色
            width: 120,
            height: 60
        });

        // 💡 生产环境核心提示：
        // 此时需要将验证码的正确文本转为小写后存入 Session 或 Cookie 中，以便后续登录校验
        // const correctText = captcha.text.toLowerCase();

        // 2. 【核心】将标准的 SVG 字符串直接转化为前端支持的 Base64 格式
        const svgString = captcha.data;
        const base64Data = Buffer.from(svgString).toString('base64');
        const base64_img = `data:image/svg+xml;base64,${base64Data}`;

        // 3. 按您的要求格式返回
        return json({ base64_img });
    } catch (err) {
        console.error('svg-captcha 生成失败:', err);
        return json({ base64_img: '', error: '验证码生成失败' }, { status: 500 });
    }
};

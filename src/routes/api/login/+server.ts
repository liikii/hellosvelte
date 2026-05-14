import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    // 1. 获取前端传入的账号密码
    const { username, password } = await request.json();

    // 2. 模拟验证逻辑（账号：admin，密码：123456）
    if (username === 'admin' && password === '123456') {
      
      // 3. 模拟设置安全 Token：httponly=true (前端不可见，用于后端鉴权)
      cookies.set('auth_token', 'mock-jwt-token-xyz-123', {
        path: '/',
        httpOnly: true,
        secure: true, // 生产环境强制 HTTPS
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1天有效期
      });

      // 4. 设置前端状态标记：httpOnly=false (前端可见，专供 $effect 守卫判断)
      cookies.set('isLogin', 'true', {
        path: '/',
        httpOnly: false, // 允许前端通过 document.cookie 读取
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24
      });

      // 5. 返回成功响应
      return json({ code: 0, success: true, message: '登录成功' });
    }

    // 6. 验证失败响应
    return json(
      { success: false, message: '账号或密码错误' },
      { status: 401 } // 返回 401 状态码
    );

  } catch (error) {
    return json(
      { success: false, message: '非法的请求数据' },
      { status: 400 }
    );
  }
};

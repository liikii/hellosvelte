import { json, type RequestHandler } from '@sveltejs/kit';
import crypto from 'node:crypto';

//  ssh-keygen -t rsa -b 2048 -m PEM -f ~/testrsa/testkey_rsa
//  ssh-keygen -e -m PKCS8 -f ~/testrsa/testkey_rsa > ~/testrsa/testkey_rsa_final.pub
// ==========================================
// 1. 将您新生成的私钥直接以字串变量保存
// ==========================================
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA8Wyd2XVBcEh3ek205WKMtnLPWEKfTyf5/IBIaZTLtYxCT6t1
3kWBwfQQx53QDRvWzVVtKKCik2wRtG4Mse6MPmudGOvZ/21lB44d6M9t6nrmi2cl
GnhCNcGS/GXa3XNUYj2C5Yglrv7nxQx0oIuiz+LY/+S73Myduo3nl7JS7K8b0ujX
j25VJUpimfH/G6vyjjARJ7EcDBK1a6rt3/iVXS7YsFZeNGTxoxv42vMAtSucfgsg
t6RBmM0XxI2sz57kcmMeZKgKIQLZ8BeXDNFzMg9oapfzw+wY7O2TXynhfndDLMUb
9na4fPDDMAaUwTkNkbiUy/9ihuouvlJtsk7EowIDAQABAoIBADAPBSUiuFIXuuD3
0wjOo2A2XpwdNwVU2eivyLpryllrgE/HvADxKTFo2mZCPgY+AnaBiOdLgtGB88xN
E+3fpL9QQMeTO6QjLLdiTQXpNOI2cOpTMAmi4ts8m3vu8rCeoq+juwjiH05Eo/KP
1i+XXGOxrqzR5avAd62JTg7eiq9ekVOL0yq+HSsIB+6W9Th+JreCZRzjruHbMWzo
Ohyap7eyAUw1w0H4lyLBDWidBoAroKzrBlYHwxZ2E/qd+OrU0rPrKBeT0YV2gi1o
FSuQPMNyL4srdpPriMs7AYWV4VSjP5z+B0A6s2fuN7m32I3s+KQJW5Os2Xy4MGsk
pIRQF4ECgYEA/rm9E/PktOkRQ87DIf0/nkBi1ysV6Iop8ghPQfMrwPMU5F+VLdm5
cYdlTC+c3V4z51cQnzU7WnW+vva66PdcuP35UT8e8MEQ3hEbhEvFnB80mmWkefhQ
0eBox4iNUY38ZVXhcIPAfwcdy0JuKnN8GNG5yuIrjJcaTj47eyZQz6ECgYEA8qHX
XyqkRolHOtebQ6O2y0OxldX5CtGTnTM126GrMJiI1+W175COrB2X+yrWXwxb4qqn
ZeYhnFSFpTOqvlWnWrs3IoftJ3plc7ChXXIYbn1tclqa0xdtWJOlUPLDM4tzNW5i
i+Ozhg45A5/lr01a3qyRk01itOZ6VpCNUbz/fcMCgYEA4RHW2nFvDNa+1Y405qxw
8PBtJTfBtOWXqG7lMR2e9G8Ub7FxC8FMVN7Qh5+uV/7rl6ZbXoFXf1d4gh1aC4y9
lgt6pupB+XJt5/lvudaFtavw+9eBm+/n4XoKuvuR+pSdhiB7AMK5bMQp9DYvRz0h
UoDFTFnJJwFAUhA02FyDnOECgYEAgIp9L03H+haARgwzlYIGNWmHi3nwlmqxaXbX
8aOUrgohdT+dQ22yKD0FZ2sqZvCFPXBrfvCMneWpZ/wXWP7HyqmkbAbW/TM6zC+n
TXpEt0R71zlpDKw8odCWpGv4PjaCsqvoSXQ4h6zBR8pORLEWkyGZfhBhWrU/2tx6
AfO+50ECgYEA3cEiD8gNw69FGLEuubDC9Bk8pJglijT2H/idoCaSsb43Du86srvz
VF1U3+GDJppfBHT16fsTfngM3zWwyU6hCuWS+vFVAxhHtr9I3IuXTEgG9tUJTkKy
XlRl82OV0/ThBj8a5rkCspL/4JYkI0lwd/TJ5SziKvsH5ycwJRRyLP0=
-----END RSA PRIVATE KEY-----`;

/**
 * 独立的 RSA-OAEP (SHA-256) 解密函数
 * @param encryptedBase64 前端传过来的 Base64 密文字符串
 * @returns 解密后的明文字符串
 */
function decryptWithRsa(encryptedBase64: string): string {
  if (!encryptedBase64) {
    throw new Error('解密密文不能为空');
  }

  // 使用 Node.js 原生 crypto 模块执行解密
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: PRIVATE_KEY,
      // 👉 核心：必须与前端 Web Crypto 的配置严格对齐
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256', 
    },
    Buffer.from(encryptedBase64, 'base64') // 将前端的 Base64 还原为字节流
  );

  return decryptedBuffer.toString('utf8');
}

// ==========================================
// 2. 路由处理核心逻辑
// ==========================================
export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    // 获取前端传入的账号、密码、验证码
    const { username, password, captcha } = await request.json();

    // 打印日志：方便测试时肉眼比对数据
    console.log('--- [测试用] 接收到前端请求数据 ---');
    // console.log('明文密码 (password):', password);
    console.log('加密密文 (encrypted_password):', password);

    let plain_password = ''; // 默认使用明文

    // 如果前端传了加密字段，我们将其解密并用于后续的登录逻辑校验
    if (password) {
      try {
        plain_password = decryptWithRsa(password);
        console.log('解密后的密码 (decrypted):', plain_password);
        

        // 将解密后的密码赋予后续的验证逻辑
      } catch (decryptError: any) {
        console.error('❌ 解密失败原因:', decryptError.message);
        return json(
          { success: false, msg: '密码安全解密失败，密钥不匹配或数据损坏' },
          { status: 400 }
        );
      }
    }

    // 模拟验证逻辑（使用最终确定的密码 finalPassword）
    if (username === 'admin' && plain_password === '123456') {
      
      // 模拟设置安全 Token：httponly=true (前端不可见，用于后端鉴权)
      cookies.set('auth_token', 'mock-jwt-token-xyz-123', {
        path: '/',
        httpOnly: true,
        secure: true, // 生产环境强制 HTTPS
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1天有效期
      });

      // 设置前端状态标记：httpOnly=false (前端可见，专供 $effect 守卫判断)
      cookies.set('isLogin', 'true', {
        path: '/',
        httpOnly: false, // 允许前端通过 document.cookie 读取
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24
      });

      // 返回成功响应 (统一返回您前端 handleLogin 里期待的 code: 0)
      return json({ code: 0, success: true, message: '登录成功' });
    }

    // 验证失败响应
    return json(
      { code: 1, success: false, msg: '账号或密码错误' }, // 补上前端期待的 msg 字段
      { status: 401 } // 返回 401 状态码
    );

  } catch (error) {
    return json(
      { code: -1, success: false, msg: '非法的请求数据或系统异常' },
      { status: 400 }
    );
  }
};

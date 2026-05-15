// export function getnav() {

// }


const PEM_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8Wyd2XVBcEh3ek205WKM
tnLPWEKfTyf5/IBIaZTLtYxCT6t13kWBwfQQx53QDRvWzVVtKKCik2wRtG4Mse6M
PmudGOvZ/21lB44d6M9t6nrmi2clGnhCNcGS/GXa3XNUYj2C5Yglrv7nxQx0oIui
z+LY/+S73Myduo3nl7JS7K8b0ujXj25VJUpimfH/G6vyjjARJ7EcDBK1a6rt3/iV
XS7YsFZeNGTxoxv42vMAtSucfgsgt6RBmM0XxI2sz57kcmMeZKgKIQLZ8BeXDNFz
Mg9oapfzw+wY7O2TXynhfndDLMUb9na4fPDDMAaUwTkNkbiUy/9ihuouvlJtsk7E
owIDAQAB
-----END PUBLIC KEY-----`;

/**
 * @param plainText 需要加密的明文字符串（如密码）
 * @returns 返回 Base64 编码的密文字符串
 */
export async function encryptWithRsa(plainText: string): Promise<string> {
  if (!plainText) {
    throw new Error('加密明文不能为空');
  }

  // 2. 清理公钥字串，提取纯 Base64 部分
  const b64Clean = PEM_PUBLIC_KEY
    .replace(/-----\s*BEGIN[^-]*-----\s*/g, '')
    .replace(/-----\s*END[^-]*-----\s*/g, '')
    .replace(/\s/g, '');

  // 3. 转换为二进制 Uint8Array
  const binaryStr = atob(b64Clean);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  // 4. 浏览器原生导入公钥
  const cryptoKey = await window.crypto.subtle.importKey(
    'spki',
    bytes.buffer,
    { 
      name: 'RSA-OAEP', 
      hash: 'SHA-256' 
    },
    false,
    ['encrypt']
  );

  // 5. 执行加密
  const textBytes = new TextEncoder().encode(plainText);
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    cryptoKey,
    textBytes
  );
  
  // 6. 返回 Base64 密文
  const encryptedBytes = new Uint8Array(encryptedBuffer);
  return btoa(String.fromCharCode(...encryptedBytes));
}

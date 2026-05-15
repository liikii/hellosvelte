import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256

# pip install pycryptodome
# 要是整个配置中心获取就更好了
# ==========================================
# 1. 保存私钥的字符串变量
# ==========================================
PRIVATE_KEY = """-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----"""


def decrypt_with_rsa(encrypted_base64: str) -> str:
    """
    独立的 RSA-OAEP (SHA-256) 解密函数
    :param encrypted_base64: 前端传过来的 Base64 密文字符串
    :return: 解密后的明文字符串
    """
    if not encrypted_base64:
        raise ValueError("解密密文不能为空")

    # 1. 将前端传来的 Base64 字符串解码为原始字节流 (等价于 Buffer.from)
    cipher_bytes = base64.b64decode(encrypted_base64)

    # 2. 从字符串中导入 RSA 私钥
    private_key_obj = RSA.import_key(PRIVATE_KEY)

    # 3. 创建解密器
    # 👉 核心：必须明确指定 hashAlgo 和 mgfunc 为 SHA256，与前端和 Node.js 严格对齐
    cipher = PKCS1_OAEP.new(
        key=private_key_obj,
        hashAlgo=SHA256,
        mgfunc=lambda x, y: PKCS1_OAEP.MGF1(x, y, SHA256)
    )

    # 4. 执行解密并转换为字符串 (等价于 toString('utf8'))
    decrypted_bytes = cipher.decrypt(cipher_bytes)
    return decrypted_bytes.decode('utf-8')


# ==========================================
# 测试运行示例
# ==========================================
if __name__ == "__main__":
    # 模拟一个从前端发来的 Base64 密文（这里只是占位符，真实测试需使用前端生成的值）
    mock_frontend_data = "tWPtd99jT3ZJN2o57dSc9FxPSJAfXZvMyt2qVUW/BdsWKVEVm+JLZ2fpzVNj+MOfTrx76c2I+MKdn1t8yeWbrfkhX3oLWgKbk+4yOJBAyqdUKJ+cc6ioZ11teFa8ahxs70orvOJINVX8qJqzyAtFWgTBe0UZLU4DJiII5gqjK8yUV9rgbzde/l9mxQjynQB9Hk9sNWkzSrgxJorgh+mOIbj8kP3qJsGVXMf3QpF7yrAcF2+MUNzzUVT1uCdLoX1msc5RwIBBp3yb9du6jqJ8LgDn33Jo5v85VACygXjxmN6L7dWiSXWKxXQCtagqsS9bxav5zk6EPjn2JE7Ktdggwg=="
    print(decrypt_with_rsa(mock_frontend_data))

// 专门用来跨接口共享未激活/已绑定的临时密钥存储
export const tempStorage = new Map<string, { secret: string; createdAt: number }>();

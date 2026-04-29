import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request }) => {
        // 1. 获取表单提交的数据
        const formData = await request.formData();
        const nickname = formData.get('nickname');

        console.log('后端收到了名字:', nickname);

        // 2. 返回处理结果给前端
        return {
            success: true,
            message: `你好 ${nickname}，服务器已收到你的名字！`
        };
    }
};

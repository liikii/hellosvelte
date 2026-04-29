import type { Actions } from './$types';

export const actions: Actions = {
    // 动作 1: 新增
    create: async ({ request }) => {
        const data = await request.formData();
        const desc = data.get('description');
        console.log('执行新增逻辑:', desc);
        return { success: true, msg: `已添加: ${desc}` };
    },

    // 动作 2: 删除
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        console.log('执行删除逻辑，ID:', id);
        return { success: true, msg: `已删除 ID: ${id}` };
    }
};

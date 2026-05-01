import type { Actions } from './$types';

export const actions: Actions = {
    create: async () => {
        // 模拟后端延迟
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return { success: true };
    }
};

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // 强制重定向到首页或报错页，从而关闭该页面的手动手动访问权限
    throw redirect(307, '/v/login');
};

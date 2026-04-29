import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
    // 1. 读取名为 'visited' 的 cookie，如果没有则默认为 '0'
    const visited = cookies.get('visited') ?? '0';

    const newCount = parseInt(visited) + 1;

    // 2. 设置新值（必须带 path: '/'，否则只有当前路径能访问）
    cookies.set('visited', newCount.toString(), { path: '/' });

    return {
        count: newCount
    };
};

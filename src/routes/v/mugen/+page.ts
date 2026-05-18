import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
    // 从 URL 获取页码，默认为 1
    const page = url.searchParams.get('page') || '1';
    
    // 调用后端接口
    const res = await fetch(`/api/mugen?page=${page}`);
    const data = await res.json();

    return {
        suiteData: data.suite_data,
        total: data.total_count,
        currentPage: parseInt(page),
        limit: 10 // 对应后端每页数量
    };
};

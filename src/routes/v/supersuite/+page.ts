import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
    const page = url.searchParams.get('page') || '1';
    const limit = 10;

    const res = await fetch(`/api/super_suite?page=${page}&limit=${limit}`);
    const result = await res.json();

    return {
        list: result.data,
        total: result.total_count,
        currentPage: parseInt(page),
        limit: limit
    };
};

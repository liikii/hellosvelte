// routes/test_task/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
    // 1. Get raw values from URL (matching applyFilter keys)
    const start = url.searchParams.get('start_create_time');
    const end = url.searchParams.get('end_create_time');
    const minS = url.searchParams.get('min_status');
    const maxS = url.searchParams.get('max_status');
    const order = url.searchParams.get('order_create_time') || 'desc';
    const page = url.searchParams.get('page') || '1';

    // 2. Build API params - only add if they exist
    const apiParams = new URLSearchParams();
    if (start) apiParams.set('start_create_time', start);
    if (end) apiParams.set('end_create_time', end);
    if (minS) apiParams.set('min_status', minS);
    if (maxS) apiParams.set('max_status', maxS);
    
    apiParams.set('order_create_time', order);
    apiParams.set('page', page);

    const res = await fetch(`/api/test_task?${apiParams.toString()}`);
    const data = await res.json();

    return {
        tasks: data.data,
        total: data.total_count,
        currentPage: parseInt(page),
        limit: 10
    };
};

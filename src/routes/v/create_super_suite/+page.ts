// routes/create_super_suite/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch('/api/mugen'); // 获取所有可选的 Suite
    const data = await res.json();
    return {
        allSuites: data.suite_data || []
    };
};

export async function load({ fetch, url }) {
    const page = url.searchParams.get('page') || '1';
    const limit = 10;

    const res = await fetch(`/api/user?page=${page}&limit=${limit}`);
    // const res = await fetch(`/api/user?page=${page}&limit=${limit}`);
    const data = await res.json();

    return {
        users: data.user_data,
        total: data.total_user_count,
        currentPage: parseInt(page),
        limit: limit,
    };
}

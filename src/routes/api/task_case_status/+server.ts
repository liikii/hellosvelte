import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { task_id, case_ids } = body;

        if (!task_id || !Array.isArray(case_ids)) {
            return json({ success: false, message: 'Missing task_id or case_ids' }, { status: 400 });
        }

        // Create an object using case_id as the key
        const statusMap: Record<number, any> = {};

        case_ids.forEach((id: number) => {
            const statusCode = Math.floor(Math.random() * 5); // Mock status 0-4
            
            statusMap[id] = {
                task_id: task_id,
                case_id: id,
                suite_name: "Suite_MOCK",
                case_name: `Case_Name_${id}`,
                start_time: new Date(Date.now() - 10000).toISOString(),
                end_time: statusCode > 1 ? new Date().toISOString() : null,
                status_code: statusCode,
                status_desc: statusCode === 3 ? "Success" : "Processing..."
            };
        });

        return json({
            success: true,
            data: statusMap
        });

    } catch (error) {
        return json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
};

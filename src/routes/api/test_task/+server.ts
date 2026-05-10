import { json } from '@sveltejs/kit';
import { testTaskData } from './TestTaskData';

export function GET() {	
    let test_task_data = testTaskData;
    return json(test_task_data);
}

import { json } from '@sveltejs/kit';
import { testTaskDetailData } from './TestTaskDetail';


export function GET() {	
    let test_task_data = testTaskDetailData;
    return json(test_task_data);
}


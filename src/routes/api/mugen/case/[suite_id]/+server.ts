import { json } from '@sveltejs/kit';
import { suiteCaseData } from './SuiteCaseData';

export function GET() {	
    let suite_case_data = suiteCaseData;
    return json(suite_case_data); 
}

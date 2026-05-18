import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { suiteCaseData } from './SuiteCaseData';

export function GET() {	
    let suite_case_data = suiteCaseData;
    return json(suite_case_data); 
}


export const PUT: RequestHandler = async ({ params, request }) => {
    const { suite_id } = params;
    
    try {
        const body = await request.json();
        
        // Log the incoming data to your terminal for debugging
        console.log(`=== Mock Update for Suite: ${suite_id} ===`);
        console.log('Received Data:', JSON.stringify(body, null, 2));

        // Mock logic: In a real app, you'd update your database here
        const updatedCases = body.cases || [];

        return json({
            success: true,
            message: `Suite ${suite_id} cases updated successfully`,
            updated_at: new Date().toISOString(),
            count: updatedCases.length
        }, { status: 200 });

    } catch (err) {
        return json({ 
            success: false, 
            message: 'Failed to parse request body' 
        }, { status: 400 });
    }
};
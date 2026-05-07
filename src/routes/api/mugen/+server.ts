import { json } from '@sveltejs/kit';
import { mugenData } from './MugenData';

export function GET() {	
    let mugen_data = mugenData;
    return json(mugen_data);
}

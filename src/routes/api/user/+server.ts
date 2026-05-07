import { json } from '@sveltejs/kit';
import { userData } from './UserData';

export function GET() {	
    let user_data = userData;
   	return json(user_data);
}

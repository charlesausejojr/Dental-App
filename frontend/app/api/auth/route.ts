import { NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_URL; 

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (!action) {
        return NextResponse.json({ error : 'action is required'}, { status : 400 });
    }
 
    const user = await req.json();

    try {
        let response;
        
        if (action === 'register') {
            response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
        } else if (action === 'login') {
            response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
        } else {
            return NextResponse.json({ message: 'Invalid action.' }, { status: 400 });
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ message: data.message }, { status: response.status });
        }
        return NextResponse.json({ token : data.token });
    } catch (error) {
        console.error('Error in auth API:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

import { Dentist } from '@/lib/types';
import { NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_URL;

export async function POST(req: Request) {
    const dentistData = await req.json();

    try {
        return await createDentist(dentistData, req.headers.get('Authorization'));
    } catch (error) {
        console.error('Error in dentist API:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        return await getAllDentists(req.headers.get('Authorization'));
    } catch (error) {
        console.error('Error in dentist API:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { id, updatedDentist } = await req.json();
    try {
        return await updateDentist(id, updatedDentist, req.headers.get('Authorization'));
    } catch (error) {
        console.error('Error in dentist API:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

async function createDentist(dentistData : Dentist, token : string | null) {
    const response = await fetch(`${API_URL}/dentists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '', // Include the token
        },
        body: JSON.stringify(dentistData),
    });
    
    const data = await response.json();
    if (!response.ok) {
        return NextResponse.json({ message: data.message }, { status: response.status });
    }
    
    return NextResponse.json({ message: 'Dentist created successfully', createdDentist: data }, { status: 201 });
}

async function getAllDentists(token : string | null) {
    const response = await fetch(`${API_URL}/dentists`, {
        method: 'GET',
        headers: {
            'Authorization': token || '', // Include the token
        },
    });
    
    if (!response.ok) {
        const data = await response.json();
        return NextResponse.json({ message: data.message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}

async function updateDentist(id: string, dentistData: Dentist, token: string | null) {
    const response = await fetch(`${API_URL}/dentists/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
        body: JSON.stringify(dentistData),
    });

    if (!response.ok) {
        const data = await response.json();
        return NextResponse.json({ message: data.message }, { status: response.status });
    }

    return NextResponse.json({ message: 'Dentist updated successfully' }, { status: 200 });
}

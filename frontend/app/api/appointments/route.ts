import { Appointment } from '@/lib/types';
import { NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_URL; // Your backend URL here

export async function POST(req: Request) {
    const appointmentData = await req.json();

    try {
        return await createAppointment(appointmentData, req.headers.get('Authorization'));
    } catch (error) {
        console.error('Error in appointment API:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || "";
        const id = searchParams.get('id') || "";

        if (type === "all") {
            return await getAllAppointments(req.headers.get('Authorization'));
        }
        else {
            return await getUserAppointments(id, req.headers.get('Authorization'));
        }
    } catch (error) {
        console.error('Error in appointment API:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { id, appointmentData } = await req.json();

    try {
        return await updateAppointment(id, appointmentData, req.headers.get('Authorization'));
    } catch (error) {
        console.error('Error in appointment API:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || "";

    try {
        return await cancelAppointment(id, req.headers.get('Authorization'));
    } catch (error) {
        console.error('Error in appointment API:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// Function to create an appointment
async function createAppointment(appointmentData: Appointment, token: string | null) {
    const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
        body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
        const data = await response.json();
        return NextResponse.json({ message: data.message }, { status: response.status });
    }

    return NextResponse.json({ message: 'Appointment created successfully' }, { status: 201 });
}

// Function to get user appointments
async function getUserAppointments(id : string, token: string | null) {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': token || '',
        },
    });

    if (!response.ok) {
        const data = await response.json();
        return NextResponse.json({ message: data.message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}

// Function to get ALL appointments
async function getAllAppointments(token: string | null) {
    const response = await fetch(`${API_URL}/appointments`, {
        method: 'GET',
        headers: {
            'Authorization': token || '',
        },
    });

    if (!response.ok) {
        const data = await response.json();
        return NextResponse.json({ message: data.message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}

// Function to update an appointment
async function updateAppointment(id: string, appointmentData: Appointment, token: string | null) {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
        body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
        const data = await response.json();
        return NextResponse.json({ message: data.message }, { status: response.status });
    }

    return NextResponse.json({ message: 'Appointment updated successfully' }, { status: 200 });
}

// Function to cancel an appointment
async function cancelAppointment(id: string, token: string | null) {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token || '',
        },
    });

    if (!response.ok) {
        const data = await response.json();
        return NextResponse.json({ message: data.message }, { status: response.status });
    }

    return NextResponse.json({ message: 'Appointment canceled successfully' }, { status: 200 });
}

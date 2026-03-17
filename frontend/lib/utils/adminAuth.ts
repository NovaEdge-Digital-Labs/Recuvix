import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function checkAdminAuth() {
    const cookieStore = await cookies();
    const adminKey = cookieStore.get('admin_key')?.value;

    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return false;
    }
    return true;
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: 'Unauthorized. Admin key required.' }, { status: 401 });
}

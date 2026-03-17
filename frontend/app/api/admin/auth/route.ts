import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json()

        if (password === process.env.ADMIN_SECRET_KEY) {
            const response = NextResponse.json({ success: true })

            // Set httpOnly cookie for 24 hours
            response.cookies.set('admin_key', password, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/admin',
                maxAge: 60 * 60 * 24, // 24 hours
            })

            return response
        }

        return NextResponse.json({ error: 'Incorrect secret key' }, { status: 401 })
    } catch (error) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
}

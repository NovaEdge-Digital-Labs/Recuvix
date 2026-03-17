const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_SECRET_KEY',
    'RAZORPAY_KEY_SECRET',
    'RESEND_API_KEY',
    'CLOUDINARY_API_SECRET',
    'PLATFORM_KEY_ENCRYPTION_SECRET',
    'INTERNAL_API_KEY',
]

required.forEach(key => {
    if (!process.env[key]) {
        throw new Error(
            `Missing required env variable: ${key}`
        )
    }
})

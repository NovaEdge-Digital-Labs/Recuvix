import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const SECRET = process.env.PLATFORM_KEY_ENCRYPTION_SECRET || 'fallback-secret-for-initial-setup-only'

function getKeyAndIV(secret: string): { key: Buffer, iv: Buffer } {
    const hash = crypto.createHash('sha256').update(secret).digest()
    // key = first 32 bytes, iv = first 16 bytes
    return { key: hash, iv: hash.slice(0, 16) }
}

export function encryptKey(plaintext: string): string {
    if (!plaintext) return ''
    const { key, iv } = getKeyAndIV(SECRET)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final()
    ])
    return encrypted.toString('base64')
}

export function decryptKey(encrypted: string): string {
    if (!encrypted) return ''
    try {
        const { key, iv } = getKeyAndIV(SECRET)
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encrypted, 'base64')),
            decipher.final()
        ])
        return decrypted.toString('utf8')
    } catch (err) {
        console.error('Failed to decrypt key:', err)
        return ''
    }
}

export function maskKey(plaintext: string): string {
    if (!plaintext) return '••••••'
    if (plaintext.length < 8) return '••••••'
    return '••••••' + plaintext.slice(-6)
}

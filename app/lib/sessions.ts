'use-server'

import { cookies } from 'next/headers'
import { USER_KEY } from '@/utils/storage/constants'
 
export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await (await cookies()).set(
        USER_KEY,
        userId,
        {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: 'lax',
            path: '/',
        }
    )
}

export async function deleteSession() {
    await (await cookies()).set(USER_KEY, '', {
        expires: new Date(0),
        path: '/',
    })
}

export async function getSession() {
    const session = await (await cookies()).get(USER_KEY)
    return session?.value as string;
}


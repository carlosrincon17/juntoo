'use-server'

import { cookies } from 'next/headers'
import { SESSION_KEY } from '@/utils/storage/constants'
import { User } from '../types/user'

export async function createUserSession(user: User) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await (await cookies()).set(
        SESSION_KEY,
        JSON.stringify(user),
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
    await (await cookies()).set(SESSION_KEY, '', {
        expires: new Date(0),
        path: '/',
    })
}

export async function getSession(): Promise<User | undefined> {
    const session = await (await cookies()).get(SESSION_KEY)
    if (!session) {
        return;
    }
    return JSON.parse(session?.value as string) as User;
}


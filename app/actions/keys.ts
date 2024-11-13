'use server'

export const getGoogleApiKey = async (): Promise<string> => {
    return process.env.GOOGLE_OAUTH_CLIENT_ID as string;
}
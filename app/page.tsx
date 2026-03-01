'use client'

import { signIn } from "./actions/auth";
import { GoogleCredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Suspense, useEffect, useState } from "react";
import { GoogleUsers } from "./types/google-user";
import { useSearchParams } from 'next/navigation';
import { Family } from './types/family';
import { getFamilyByReferenceCode } from './actions/family';
import Image from "next/image";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!;

function Home() {

    const [family, setFamily] = useState<Family>();
    const searchParams = useSearchParams()

    const selectUser = (credentialResponse: GoogleCredentialResponse) => {
        const credential = credentialResponse.credential;
        if (!credential) {
            return;
        }
        localStorage.setItem("credentials", credential);
        if (family) localStorage.setItem("family", JSON.stringify(family));
        const credentialData: GoogleUsers = jwtDecode(credential);
        signIn(credentialData.email);
    }

    const getFamilyByReference = async () => {
        const familyReference = searchParams.get('family');
        if (!familyReference) {
            return;
        }
        const family = await getFamilyByReferenceCode(familyReference);
        setFamily(family);
    }

    useEffect(() => {
        localStorage.removeItem("family");
        localStorage.removeItem("credentials");
        getFamilyByReference();
    }, []);

    const getLoginText = () => {
        if (family) {
            return (
                <div className='flex flex-col items-center  text-gray-900'>
                    <span className='text-xl font-extralight'>
                        Fuiste invitado a la familia
                    </span>
                    <span className='text-xl font-bold'> {family.name} </span>
                    <br />
                    <span className='font-extralight'>
                        Inicia sesión con google para comenzar a gestionar tus finanzas
                    </span>
                </div>
            );
        }
        return (
            <span className='text-xl font-extralight text-gray-900'>
                Inicia sesión con google para crear tu familia y comienza a gestionar tus finanzas
            </span>
        )
    }

    return (
        <>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
                    <div className="mb-8 text-center">
                        <Image
                            src="/juntoo.webp"
                            alt="Juntoo"
                            width={200}
                            height={60}
                            priority
                        />
                        <p className="text-sm text-gray-500 mt-2">Porque todo es mejor con tu familia cuando están juntos</p>
                    </div>

                    <div className='mb-10'>
                        {getLoginText()}
                    </div>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            selectUser(credentialResponse)
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />

                    <p className="mt-8 text-xs text-center text-gray-500">
                        Conoce cómo se comporta y se mueve tu dinero... <br />
                        Establece metas financieras que sean realistas y alcanzables... <br />
                        Siempre ten un ahorro para cualquier gasto imprevisto...
                    </p>
                </div>
            </GoogleOAuthProvider>
        </>
    );
}

export default function SuspenseHome() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Home />
        </Suspense>
    );
}
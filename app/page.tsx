'use client'

import { FaPiggyBank } from 'react-icons/fa';
import { signIn } from "./actions/auth";
import { GoogleCredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { getGoogleApiKey } from "./actions/keys";
import { Suspense, useEffect, useState } from "react";
import { GoogleUsers } from "./types/google-user";
import { useSearchParams } from 'next/navigation';
import { Family } from './types/family';
import { getFamilyByReferenceCode } from './actions/family';

function Home() {
    
    const [googleClientId, setGoogleClientId] = useState<string>();
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

    const getGoogleApiKeyData = async () => {
        const googleClientId = await getGoogleApiKey();
        setGoogleClientId(googleClientId);
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
        getGoogleApiKeyData();
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
            {
                googleClientId && 
                <GoogleOAuthProvider clientId={googleClientId}>
                    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl text-white font-bold"><FaPiggyBank /></span>
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-900">Cashly App</h1>
                            <p className="text-sm text-gray-500 mt-2">Manage your money wisely</p>
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
            }
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
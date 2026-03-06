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
import { FaWallet, FaBullseye, FaChartPie } from "react-icons/fa";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!;

const features = [
    {
        icon: <FaWallet className="h-4 w-4" />,
        label: "Seguimiento inteligente",
        desc: "Visualiza ingresos y gastos en tiempo real con categorías detalladas",
    },
    {
        icon: <FaBullseye className="h-4 w-4" />,
        label: "Metas financieras",
        desc: "Define objetivos de ahorro alcanzables y mide tu progreso mes a mes",
    },
    {
        icon: <FaChartPie className="h-4 w-4" />,
        label: "Balance patrimonial",
        desc: "Conoce tu balance neto entre ahorros, activos y deudas en un solo lugar",
    },
]

function Home() {
    const [family, setFamily] = useState<Family>();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const searchParams = useSearchParams()

    const selectUser = (credentialResponse: GoogleCredentialResponse) => {
        const credential = credentialResponse.credential;
        if (!credential) return;
        setIsSigningIn(true);
        localStorage.setItem("credentials", credential);
        if (family) localStorage.setItem("family", JSON.stringify(family));
        const credentialData: GoogleUsers = jwtDecode(credential);
        signIn(credentialData.email);
    }

    const getFamilyByReference = async () => {
        const familyReference = searchParams.get('family');
        if (!familyReference) return;
        const family = await getFamilyByReferenceCode(familyReference);
        setFamily(family);
    }

    useEffect(() => {
        localStorage.removeItem("family");
        localStorage.removeItem("credentials");
        getFamilyByReference();
    }, []);

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="min-h-screen w-full flex">

                {/* ── Left panel: branding ────────────────────────────── */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] relative overflow-hidden flex-col justify-between p-12">
                    {/* Decorative blurs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6366f1]/20 rounded-full blur-3xl translate-y-24 -translate-x-24 pointer-events-none" />

                    {/* Logo */}
                    <div className="relative z-10">
                    </div>

                    {/* Headline + features */}
                    <div className="relative z-10 space-y-10">
                        <div className="space-y-3">
                            <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
                                El dinero de tu familia,<br />bajo control.
                            </h2>
                            <p className="text-white/50 text-base font-light leading-relaxed max-w-sm">
                                Porque todo es mejor cuando están juntos — gestiona, ahorra y crece como familia.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {features.map(({ icon, label, desc }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <div className="mt-0.5 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/70 flex-shrink-0">
                                        {icon}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold">{label}</p>
                                        <p className="text-white/40 text-xs font-light mt-0.5 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom tagline */}
                    <p className="relative z-10 text-white/20 text-xs font-light">
                        © {new Date().getFullYear()} Juntoo · Finanzas familiares
                    </p>
                </div>

                {/* ── Right panel: login ──────────────────────────────── */}
                <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-16 relative">
                    {/* Subtle background grid */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.025]"
                        style={{ backgroundImage: "radial-gradient(circle, #312e81 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                    />

                    {/* Logo — top right */}
                    <div className="absolute top-6 right-6 z-10">
                        <Image src="/juntoo.webp" alt="Juntoo" width={100} height={30} priority />
                    </div>

                    <div className="relative z-10 w-full max-w-sm space-y-8">

                        {/* Heading */}
                        <div className="space-y-1.5">
                            {family ? (
                                <>
                                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Invitación familiar</p>
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Únete a {family.name}</h1>
                                    <p className="text-sm text-gray-400 font-light pt-1">Inicia sesión para comenzar a gestionar las finanzas de tu familia.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Bienvenido</p>
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Accede a tu cuenta</h1>
                                    <p className="text-sm text-gray-400 font-light pt-1">Gestiona las finanzas de tu familia de forma inteligente.</p>
                                </>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100" />

                        {/* Login action */}
                        {isSigningIn ? (
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="w-9 h-9 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
                                <p className="text-sm text-gray-400 font-light">Iniciando sesión...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest text-center">Continuar con</p>
                                <div className="flex justify-center">
                                    <GoogleLogin onSuccess={selectUser} onError={() => console.log('Login Failed')} />
                                </div>
                            </div>
                        )}

                        {/* Footer note */}
                        <p className="text-xs text-center text-gray-300 leading-relaxed">
                            Al continuar, aceptas el uso de tu cuenta de Google para autenticarte de forma segura.
                        </p>
                    </div>
                </div>

            </div>
        </GoogleOAuthProvider>
    );
}

export default function SuspenseHome() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-white">
                <div className="w-9 h-9 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        }>
            <Home />
        </Suspense>
    );
}
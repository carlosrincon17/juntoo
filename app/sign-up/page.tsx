'use client'

import { FormEvent, useEffect, useState } from "react";
import { createFamily } from "../actions/family";
import { User } from "../types/user";
import { GoogleUsers } from "../types/google-user";
import { jwtDecode } from "jwt-decode";
import { createUser } from "../actions/users";

export default function WelcomeRegistration() {
    const [showContent, setShowContent] = useState(false);
    const [showSecondInput, setShowSecondInput] = useState(false);
    const [formData, setFormData] = useState({
        familyName: '',
        userName: ''
    });
    useEffect(() => {
        setTimeout(() => setShowContent(true), 100);
    }, []);
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const credentials = localStorage.getItem("credentials");
        if (!credentials) {
            return;
        }
        const googleUser = jwtDecode(credentials) as GoogleUsers;
        const family = await createFamily(formData.familyName);
        const userData: User = {
            name: formData.userName,
            email: googleUser.email,
            family_id: family.id,
            isActive: true,
            isAdmin: true,
        };
        await createUser(userData);
    };
  
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">

            <div 
                className={`transition-all duration-1000 ease-out transform ${
                    showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
            >
                <div className="w-16 h-16 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">C</span>
                </div>
            </div>
  
            {/* Welcome Text */}
            <div 
                className={`text-center mb-12 transition-all duration-1000 delay-300 ease-out transform ${
                    showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
            >
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Bienvenido a Cashly
                </h1>
                <p className="text-gray-500">
            La app de finanzas personales
                </p>
            </div>
  
            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
                {/* Family Name Input */}
                <div 
                    className={`transition-all duration-1000 delay-500 ease-out transform ${
                        showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo quieres llamar a tu familia?
                    </label>
                    <input
                        type="text"
                        value={formData.familyName}
                        onChange={(e) => {
                            setFormData({ ...formData, familyName: e.target.value });
                            if (e.target.value.length > 2 && !showSecondInput) {
                                setShowSecondInput(true);
                            }
                        }}
                        className="w-full px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all duration-200"
                        placeholder="ej: Los Pérez"
                        autoFocus
                    />
                </div>
  
                {/* User Name Input */}
                <div 
                    className={`transition-all duration-700 transform ${
                        showSecondInput ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
                    }`}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo quieres llamarte en la aplicación?
                    </label>
                    <input
                        type="text"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        className="w-full px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all duration-200"
                        placeholder="ej: Juan"
                    />
                </div>
  
                {/* Continue Button */}
                <button
                    type="submit"
                    className={`w-full py-3 px-4 bg-gray-900 text-white rounded-lg transition-all duration-500 transform hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
                        formData.userName && formData.familyName 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-4 opacity-0 pointer-events-none'
                    }`}
                >
                    Continuar
                </button>
            </form>
  
            {/* Progress Indicator */}
            <div className={`flex space-x-2 mt-8 transition-all duration-1000 delay-700 transform ${
                showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    !showSecondInput ? 'bg-gray-900' : 'bg-gray-200'
                }`} />
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    showSecondInput ? 'bg-gray-900' : 'bg-gray-200'
                }`} />
            </div>
        </div>
    );
};

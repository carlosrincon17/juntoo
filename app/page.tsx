'use client'

import { StorageUsers } from "@/utils/storage/constants";
import { FaMale, FaFemale } from 'react-icons/fa';
import { signUp } from "./actions/auth";

export default function Home() {
  
    const selectUser = (user: StorageUsers) => {
        signUp(user)
    }

    return (
        <div className="flex items-center justify-center min-h-screen flex-col">
            <h1 className="text-center text-4xl font-bold text-gray-900">Cashly</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="flex flex-col items-center p-8 bg-gradient-to-br rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer w-48 h-48 from-teal-500 to bg-cyan-700"
                    onClick={() => selectUser(StorageUsers.Carlos)}>
                    <div className="text-2xl font-bold text-white mb-4">Carlos</div>
                    <FaMale size={"4em"} className="text-white"/>
                </div>

                <div className="flex flex-col items-center p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer w-48 h-48 bg-gradient-to-br from-amber-500 to bg-rose-500"
                    onClick={() => selectUser(StorageUsers.Maye)}>
                    <div className="text-2xl font-bold text-white mb-4">Maye</div>
                    <FaFemale size={"4em"} className="text-white"/>
                </div>
            </div>
        </div>
    );
}

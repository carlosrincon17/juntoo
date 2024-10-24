'use client'

import { StorageUsers } from "@/utils/storage/constants";
import { FaMale, FaFemale } from 'react-icons/fa';
import { signUp } from "./actions/auth";

export default function Home() {
  
    const selectUser = (user: StorageUsers) => {
        signUp(user)
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex space-x-8">
                <div className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer w-48 h-48 hover:bg-gray-700"
                    onClick={() => selectUser(StorageUsers.Carlos)}>
                    <div className="text-2xl font-bold text-white mb-4">Carlos</div>
                    <FaMale size={"4em"}/>
                </div>

                <div className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer w-48 h-48 hover:bg-gray-700"
                    onClick={() => selectUser(StorageUsers.Maye)}>
                    <div className="text-2xl font-bold text-white mb-4">Maye</div>
                    <FaFemale size={"4em"}/>
                </div>
            </div>
        </div>
    );
}

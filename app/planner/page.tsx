'use client'

import { useState, useEffect } from 'react'
import { User } from '../types/user'
import { getUsersByFamily } from '../actions/users'
import { TaskList } from './components/task-list';


export default function Page() {
    const [familyUsers, setFamilyUsers] = useState<User[]>([]);


    const loadUsersFamily = async () => {
        const users = await getUsersByFamily();
        setFamilyUsers(users);
    }

    useEffect(() => { 
        loadUsersFamily() 
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        Tareas Familiares
                    </h1>
                    <p className="text-gray-500 font-light text-sm max-w-2xl">
                        Asigna y organiza tareas para la familia.
                    </p>
                </div>
            </div>
            
            <div className="flex justify-center items-start w-full flex-wrap gap-4 mt-6">
                <TaskList />
                {familyUsers.map((user) => {
                    return (<TaskList key={user.id} user={user}/>)
                })}
            </div>
        </div>
    )
}


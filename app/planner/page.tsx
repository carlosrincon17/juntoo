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
        <div className="flex justify-center items-center w-full flex-wrap">
            <TaskList />
            {familyUsers.map((user) => {
                return (<TaskList key={user.id} user={user}/>)
            })}
        </div>
    )
}


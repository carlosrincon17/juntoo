'use client'

import { User } from "@/app/types/user";
import { Button, Card, Checkbox, Input, Progress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaPlus } from "react-icons/fa";

interface Task {
    id: number
    title: string
    completed: boolean
  }

export function TaskList(props: { user?: User }) {

    const { user } = props;

    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState('')

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
            const data = await response.json()
            setTasks(data)
        }
        fetchTasks()
    }, [])

    const addTask = () => {
        if (newTask.trim() !== '') {
            setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }])
            setNewTask('')
        }
    }

    const toggleTask = (id: number) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const getTitle = () => {
        if (user) {
            return `Tareas para ${user.name}`;
        }
        return "Tareas para toda la familia";
    }


    const completedTasks = tasks.filter(task => task.completed).length
    const totalTasks = tasks.length
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    return (
        <div className="px-4 py-8 w-full md:w-1/2 lg:w-1/3">
            <Card className="p-6 shadow-lg">
                <h2 className="text-2xl font-light text-center mb-6">{getTitle()}</h2>
                <div className="flex mb-4">
                    <Input 
                        placeholder="Add a new task" 
                        value={newTask}
                        onValueChange={setNewTask}
                        className="flex-grow mr-2"
                        size="sm"
                    />
                    <Button isIconOnly color="primary" variant="flat" onPress={addTask} size="sm">
                        <FaPlus size={20} />
                    </Button>
                </div>
                <div className="space-y-2">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                                <Checkbox
                                    isSelected={task.completed}
                                    onValueChange={() => toggleTask(task.id)}
                                    className="mr-2"
                                    size="sm"
                                />
                                <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                    {task.title}
                                </span>
                            </div>
                            <Button 
                                isIconOnly
                                color="danger" 
                                variant="light"
                                onPress={() => deleteTask(task.id)}
                                size="sm"
                            >
                                <FaCheckCircle size={16} />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <Progress 
                        value={progressPercentage} 
                        className="mb-2"
                        size="sm"
                    />
                    <p className="text-xs text-gray-500 text-right">
                        {completedTasks} of {totalTasks} tasks completed
                    </p>
                </div>
            </Card>
        </div>
    )
};
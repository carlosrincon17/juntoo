"use client"

import type React from "react"
import { useState, useEffect } from "react"
import * as FiIcons from "react-icons/fi"
import * as FaIcons from "react-icons/fa"
import * as MdIcons from "react-icons/md"

// Define the props interface
interface IconProps {
  name: string
  size?: number
  color?: string
}

// Create a map of icon libraries
const iconLibraries = {
    fi: FiIcons,
    fa: FaIcons,
    md: MdIcons,
}

export const Icon: React.FC<IconProps> = ({ name, size = 24 }: IconProps) => {
    const [IconComponent, setIconComponent] = useState<React.ComponentType<{size: number}> | null>(null)

    useEffect(() => {
        const loadIcon = async () => {
            const [library, iconName] = name.split("/")
            const iconSet = iconLibraries[library as keyof typeof iconLibraries]

            if (iconSet && iconSet[iconName as keyof typeof iconSet]) {
                setIconComponent(() => iconSet[iconName as keyof typeof iconSet])
            } else {
                console.error(`Icon not found: ${name}`)
            }
        }

        loadIcon()
    }, [name])

    if (!IconComponent) {
        return <span>Loading...</span>
    }

    return <IconComponent size={size} />
}


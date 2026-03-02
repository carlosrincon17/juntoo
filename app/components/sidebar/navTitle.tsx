
import Image from 'next/image'

export const NavTitle = () => {
    return (
        <div className="flex items-center gap-x-1">
            <div className="flex font-light items-center text-xl text-black focus:outline-none focus:opacity-80 dark:text-white">
                <Image src="/juntoo.webp" className="h-6 w-auto" alt="Juntoo" width={120} height={24} priority />
            </div>
        </div>
    )
}
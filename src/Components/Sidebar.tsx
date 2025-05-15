import { useState } from 'react';
import { links } from '../data/data';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`transition-all duration-300 ${isOpen ? 'w-64 p-4' : 'w-16 p-2'} bg-white shadow-md h-screen min-h-screen top-0 left-0 border-r dark:bg-gray-900 dark:border-gray-800 flex flex-col`}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="mb-4 self-end bg-gray-200 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                <span className="text-xl">{isOpen ? '⮜' : '⮞'}</span>
            </button>
         
            {isOpen && (
                <div className="flex items-center mb-4">
                    <div className="text-center w-full">
                        <h1 className="text-5xl font-bold">
                            <span className="text-green-600">ADMIN</span>
                        </h1>
                        <h2 className="text-2xl font-semibold text-gray-700 mt-1 dark:text-gray-200">DASHBOARD</h2>
                    </div>
                </div>
            )}
            
            <nav className="space-y-2">
                {links.map((link) => (
                    <a
                        href={link.url}
                        key={link.id}
                        className={`group flex items-center ${isOpen ? 'px-4 py-2' : 'px-2 py-2 justify-center'} text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400`}
                    >
                        <span className={`text-base font-medium capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 ${!isOpen && 'hidden'}`}>
                            {link.text}
                        </span>
                    </a>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
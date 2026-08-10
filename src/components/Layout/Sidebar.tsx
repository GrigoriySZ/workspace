import React from "react";
import { NavLink } from "react-router-dom";

export const Sidebar: React.FC = () => {
    return(
        <aside className="fixed top-0 left-0 w-65 h-screen bg-gray-900
            flex flex-col border-r border-gray-700 text-gray-500"
        >
            <div className="p-6 text-xl font-bold text-white border-b border-gray-700">
                Workspace Flow
            </div>
            <nav className="flex flex-col py-4 gap-2 grow">
                <NavLink to='/' className={({ isActive }) => 
                    `flex items-center py-3 px-6 no-underline${isActive 
                        ? "bg-gray-800 text-blue-400 border-l-4 border-blue-400" 
                        : "text-gray-400"}`}
                >
                    Главная
                </NavLink>
                <NavLink to='/booking' className={({ isActive }) => 
                    `flex items-center py-3 px-6 no-underline${isActive 
                        ? "bg-gray-800 text-blue-400 border-l-4 border-blue-400" 
                        : "text-gray-400"}`}
                >
                    Бронирование
                </NavLink>
                <NavLink to='/profile' className={({ isActive }) => 
                    `flex items-center py-3 px-6 no-underline${isActive 
                        ? "bg-gray-800 text-blue-400 border-l-4 border-blue-400" 
                        : "text-gray-400"}`}
                >
                    Профиль
                </NavLink>
            </nav>
        </aside>
    )
}
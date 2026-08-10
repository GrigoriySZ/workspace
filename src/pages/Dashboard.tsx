import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface BookingRecord {
    id: string;
    resourceName: string;
    time: string;
    date: string;
    status: 'Confirmed' | 'Cancelled';
};

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const userCtx = useContext(UserContext);
    if (!userCtx) throw Error("UserContext не найден");
    const { user } = userCtx;
    const [upcoming] = useState<BookingRecord[]>(() => {
        const saved: BookingRecord[] = JSON.parse(localStorage.getItem('user_booking') || '[]');
        return saved.filter(b => b.status === 'Confirmed');
    });

    return (
        <div className="flex flex-col gap-4 max-w-6xl min-w-xl m-auto">
            <div className="w-full mb-4">
                <h1 className="text-2xl font-bold">
                    Привет, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                    Добро пожаловать в рабочее пространство Workspace Flow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense">
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="mb-4">
                        <span className="text-xs uppercase text-gray-500">
                            Ваш баланс
                        </span>
                        <h3 className="text-lg font-bold">
                            Доступные часы
                        </h3>
                    </div>
                    <div >
                        <span className="text-3xl font-bold text-indigo-700 font-stretch-150%">
                            {user.monthlyHoursLimit - user.usedHours}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                            / {user.monthlyHoursLimit} ч.
                        </span>
                    </div>
                </div>

                <div className="md:col-span-2 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div>
                        <span className="text-xs uppercase text-gray-500">
                            Статистика хаба
                        </span>
                        <h3 className="text-lg font-bold mb-4">
                            Загруженность офиса сегодня
                        </h3>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm font-medium text-black">
                            <span>
                                Занято рабочих зон
                            </span>
                            <span>
                                68%
                            </span>
                        </div>
                        
                        <div className="w-full h-4 my-2 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                            <div className={`h-4 w-[68%] left-0 inset-y-0 rounded-full
                                bg-linear-to-r from-indigo-500 to-purple-500`}
                            >

                            </div>
                        </div>
                        <p className="text-xs font-medium text-gray-500">
                            Пик загруженность ожидается к 14:00. Рекомендуем бронировать переговорные заранее
                        </p>
                    </div>
                </div>

                <div className="h-fit py-4 px-6 bg-white border border-gray-100 rounded-xl shadow-sm md:col-span-2">
                    <h3 className="text-base text-black font-bold mb-4">
                        Ближайшие бронирования
                    </h3>
                    {upcoming.length === 0 ? (
                        <div className="w-full text-center h-20 content-center text-sm text-gray-500">
                            У вас нет бронирований
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {upcoming.slice(-3).reverse().map((b) => (
                                <div key={b.id}
                                    className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-md"
                                >   
                                    <div>
                                        <h4 className="text-sm font-bold tracking-wide">
                                            {b.resourceName}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            {b.date} • {b.time}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 font-medium rounded-md
                                        ${b.status === 'Confirmed' 
                                            ? "bg-indigo-100 text-indigo-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {b.status === 'Confirmed'
                                            ? 'Активно'
                                            : 'Отменено'
                                        }
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-indigo-700 border border-gray-100 rounded-xl shadow-sm h-fit">
                    <h3 className="text-base font-bold text-white mb-2">
                        Нужно рабочее место?
                    </h3>
                    <p className="text-xs text-white mb-4">
                        Найтите свободный hot-desk или уединенную комнату на любом этаже в пару кликов
                    </p>
                    <button 
                        onClick={() => navigate('/booking')}
                        className="w-full p-2 bg-indigo-700 hover:bg-white rounded-md border-2 border-white
                        text-xs font-bold text-white hover:text-indigo-700
                        cursor-pointer transition-colors duration-300"
                    >
                        Забронировать ресурс
                    </button>
                </div>
            </div>
        </div>
    );
};
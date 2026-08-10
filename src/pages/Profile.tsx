import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

interface BookingRecord {
    id: string;
    resourceName: string;
    resourceType: 'desk' | 'room';
    floor: number;
    time: string;
    date: string;
    hour: number;
    status: 'Confirmed' | 'Cancelled';
};

export const Profile: React.FC = () => {
    const userCtx = useContext(UserContext);
    if (!userCtx) throw Error("UserContext не найден");
    const {user, refundHours} = userCtx;
    const [bookings, setBookings] = useState<BookingRecord[]>(() => {
        return JSON.parse(localStorage.getItem('user_booking') || '[]');
    });
    
    const handleCancelBooking = (bookingId:string, hourToRefund: number) => {
        refundHours(hourToRefund);
        const updateBooking = bookings.map(b => 
            b.id === bookingId 
            ? {...b, status: 'Cancelled' as const}
            : b
        );
        setBookings(updateBooking);
        localStorage.setItem('user_booking', JSON.stringify(updateBooking));
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl min-w-3xl m-auto">
            <div className="flex justify-between items-center p-4 bg-white
                border border-gray-100 rounded-xl shadow-sm"
            >
                <div>
                    <h1 className="text-2xl font-bold text-black">
                        {user.name}
                    </h1>
                    <p className="text-xs text-gray-500 font-semibold">
                        {user.department} • {user.role}
                    </p>
                </div>
                <div className="px-4 py-2 bg-indigo-50 rounded-md text-xs text-indigo-700 font-bold">
                    Использовано лимита: {user.usedHours} из {user.monthlyHoursLimit} ч.
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
                <h2 className="p-4 text-lg text-black font-bold">
                    История ваших бронирований
                </h2>
                {bookings.length === 0 ? (
                    <div className="p-4 w-full h-20 text-center text-sm text-gray-500">
                        Вы ещё ничего не бронировали
                    </div>
                ) : (
                    <div>
                        <table className="w-full">
                            <thead>
                                <tr className="grid grid-cols-6 p-4 bg-gray-100 gap-4
                                    text-xs text-gray-500 tracking-wide uppercase justify-items-start"
                                >
                                    <th className="col-span-2">Ресурс</th>
                                    <th>Дата/Время</th>
                                    <th>Списание</th>
                                    <th>Статус</th>
                                    <th className="place-self-end">Действие</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {bookings.map((b) => (
                                    <tr key={b.id} className="grid grid-cols-6 py-3 px-4 gap-4
                                        text-xs tracking-wide justify-items-start items-center"
                                    >
                                        <td className="col-span-2">
                                            <p className="text-black font-bold">
                                                {b.resourceName}
                                            </p>
                                            <p className="text-gray-500 text-[10px]">
                                                {b.floor} этаж • {b.resourceType === 'room' ? 'Переговорная' : 'Место'}
                                            </p>
                                        </td>

                                        <td>
                                            <p>{b.date}</p>
                                            <p className="text-[10px]">{b.time}</p>
                                        </td>
                                        
                                        <td>
                                            <p className="font-bold">{b.hour} ч.</p>
                                        </td>
                                        
                                        <td className={`py-1 px-2 rounded-full font-semibold ${b.status === 'Confirmed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'Отменено'}`}
                                        >
                                            {b.status === 'Confirmed' ? 'Подтверждено' : 'Отменено'}
                                        </td>
                                        <td className="place-self-end">
                                            {b.status === 'Confirmed' && (
                                                <button
                                                className="py-1 px-2 bg-red-100 hover:bg-red-600 rounded-md 
                                                    text-red-600 font-bold hover:text-white 
                                                    transition-colors duration-300 cursor-pointer"
                                                    onClick={() => handleCancelBooking(b.id, b.hour)}
                                                >
                                                    Отменить
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
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
        <div className="container">
            <div>
                <div>
                    <h1>{user.name}</h1>
                    <p>{user.department} * {user.role}</p>
                </div>
                <div>
                    Использовано лимита: {user.usedHours} из {user.monthlyHoursLimit} ч.
                </div>
            </div>

            <div>
                <h2>История ваших бронирований:</h2>
                {bookings.length === 0 ? (
                    <div>Вы ещё ничего не бронировали</div>
                ) : (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Ресурс</th>
                                    <th>Дата/Время</th>
                                    <th>Статус</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b.id}>
                                        <td>
                                            <p>{b.resourceName}</p>
                                            <p>
                                                {b.floor} * {b.resourceType === 'room' ? 'Переговорная' : 'Место'}
                                            </p>
                                        </td>

                                        <td>
                                            <p>{b.date}</p>
                                            <p>{b.time}</p>
                                        </td>
                                        
                                        <td>
                                            <p>{b.hour} ч.</p>
                                        </td>
                                        
                                        <td>{b.status === 'Confirmed' ? 'Подтверждено' : 'Отменено'}</td>
                                        <td>
                                            {b.status === 'Confirmed' && (
                                                <button
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
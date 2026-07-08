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
        <div>
            <h1>Привет, {user.name.split(' ')[0]}</h1>
            <div>
                <div>
                    <span>Ваш баланс:</span>
                    <h3>Доступные часы</h3>
                </div>
                <div>
                    <span>{user.monthlyHoursLimit - user.usedHours}</span>
                    <span>{user.monthlyHoursLimit}</span>
                </div>
            </div>
            <div>
                <h3>Ближайшие бронирования</h3>
                {upcoming.length === 0 ? (
                    <div>У вас нет бронирований</div>
                ) : (
                    <div>
                        {upcoming.slice(-3).reverse().map((b) => (
                            <div key={b.id}>
                                <h4>{b.resourceName}</h4>
                                <p>{b.date}*{b.time}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={() => navigate('/booking')}>
                Забронировать ресурс
            </button>
        </div>
    );
};
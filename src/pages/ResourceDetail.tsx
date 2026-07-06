import React, {useState, useContext, useReducer} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { bookingReducer, initialState, TimeSlot } from "../components/BookingReducer";
import { mockResources } from "../mockData/mockData";

const DAY_SLOTS: TimeSlot[] = [
    {id: 's8', time: '08:00-10:00', priceHours: 2},
    {id: 's10', time: '10:00-12:00', priceHours: 2},
    {id: 's12', time: '12:00-14:00', priceHours: 2},
    {id: 's14', time: '14:00-16:00', priceHours: 2},
    {id: 's16', time: '16:00-18:00', priceHours: 2}
];

const OCCUPIED_SLOTS = ['s12'];

export const ResourceDetail: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const useCtx = useContext(UserContext);
    if (!useCtx) throw new Error('UserContext не найден');
    const {user, deductHours} = useCtx;
    const [state, dispatch] = useReducer(bookingReducer, initialState);
    const [bookingMessage, setBookingMessage] = useState<{text: string, isError: boolean} | null>(null);

    const resource = mockResources.find(r => r.id === id);
    if (!resource) {
        return (
            <button onClick={() => navigate('/booking')}>
                Вернуться к каталогу
            </button>
        );
    }
    
    const totalHoursRequested = state.selectedSlots.reduce((sum, slot) => sum + slot.priceHours, 0);
    
    const handleConfirmBooking = () => {
        if (totalHoursRequested === 0) return;
        const success = deductHours(totalHoursRequested);
        if (success) {
            const currentBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
            const newBookings = state.selectedSlots.map(slot => ({
                id: `${resource.id}-${slot.id}-${Date.now()}`,
                resourceName: resource.name,
                resourceType: resource.type,
                floor: resource.floor,
                time: slot.time,
                date: new Date().toISOString().split('T')[0],
                hour: slot.priceHours,
                status: 'Confirmed'
            }));

            localStorage.setItem('user_booking', JSON.stringify([...currentBookings, ...newBookings]));
            setBookingMessage({text: 'Бронирование подтверждено', isError: false});
            dispatch({type: 'CLEAT_CART'});
        } else {
            setBookingMessage({text: 'Превышен ежемесячный лимит', isError: true});
        }
    };

    return (
        <div>
            <div>
                <button onClick={() => navigate('/booking')}>
                    &arrleft; Назад к каталогу
                </button>

                <div>
                    <h1>{resource.name}</h1>
                    <p>{resource.floor} этаж * {resource.type === 'room' ? 'Комната' : 'Рабочая зона'}</p>
                    <h3>Расписание</h3>
                    <div>
                        {DAY_SLOTS.map((slot) => {
                            const isOccupied = OCCUPIED_SLOTS.includes(slot.id);
                            const isSelected = state.selectedSlots.some(s => s.id === slot.id);
                            return (
                                <div key={slot.id}>
                                    <button
                                        disabled={isOccupied}
                                        onClick={() => dispatch({type: 'TOGGLE_SLOT', payload: slot})}
                                    >
                                        <span>{slot.time.split('-')[0]}</span>
                                        <span>
                                            {isOccupied ? 'Занят' : isSelected ? 'В черновику': 'Свободен'}
                                        </span>
                                    </button>
                                    <div></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <div>
                        <h3>Ваш лимит</h3>
                        <p>{user.department}</p>
                        <div>
                            <span>{user.monthlyHoursLimit - user.usedHours}</span>
                            <span>{user.monthlyHoursLimit} ч.</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2>Черновик <span>{state.selectedSlots.length} слотов</span></h2>
                    {state.selectedSlots.length === 0 ? (
                        <div>Выберите доступные слоты</div>
                    ) : (
                        <div>
                            {state.selectedSlots.map(slot => (
                                <div key={slot.id}>
                                    <div>
                                        <p>{slot.time}</p>
                                        <p>Засход {slot.priceHours}</p>
                                    </div>
                                    <button
                                        onClick={() => dispatch({type: 'TOGGLE_SLOT', payload: slot})}
                                    >
                                        Удалить 
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div>
                        <span>Итого к списанию:</span>
                        <span>{totalHoursRequested}</span>
                    </div>
                    <button
                        disabled={state.selectedSlots.length === 0}
                        onClick={handleConfirmBooking}
                    >
                        Подтвердить
                    </button>
                    {bookingMessage && (
                        <div>{bookingMessage.text}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
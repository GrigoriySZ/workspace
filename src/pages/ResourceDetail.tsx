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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="flex flex-col gap-6">
                <button 
                    onClick={() => navigate('/booking')}
                    className="text-sm text-gray-500 font-semibold text-left cursor-pointer 
                    hover:text-indigo-500 transition-colors duration-300"
                >
                    ← Назад к каталогу
                </button>

                <div className="w-full col-start-1 p-6 bg-white row-span-2 
                    border border-gray-100 shadow-sm rounded-xl"
                >
                    <div
                        className="h-60 w-full mb-6 bg-gray-100 
                            rounded-lg border border-gray-300"
                    ></div>
                    <h1
                        className="text-xl text-black font-bold"
                    >
                        {resource.name}
                    </h1>
                    <p className="text-xs text-gray-500 font-semibold mb-4">
                        {resource.floor} этаж • {resource.type === 'room' ? 'Комната' : 'Рабочая зона'}
                        </p>
                    <h3 className="text-black text-base font-bold">
                        Расписание
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">
                        Наведите на слот, чтобы увидеть детали, и кликните для выбора
                    </p>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                    >
                        {DAY_SLOTS.map((slot) => {
                            const isOccupied = OCCUPIED_SLOTS.includes(slot.id);
                            const isSelected = state.selectedSlots.some(s => s.id === slot.id);
                            return (
                                <div key={slot.id}
                                    className="relative inline-block group"
                                >
                                    {/* Всплывающее окно с пояснением */}
                                    <div className="absolute bottom-full left-1/2 p-2 mb-2  
                                        -translate-x-1/2 border rounded-lg bg-gray-900
                                        opacity-0 group-hover:opacity-100 invisible group-hover:visible
                                        transition-opacity duration-300 ease-in-out 
                                        pointer-events-none whitespace-nowrap"
                                    >
                                        <span className="block text-xs text-white font-semibold">
                                            {slot.time}
                                        </span>
                                        <span className="block text-xs text-gray-500">
                                            Стоимость: {slot.priceHours} ч.
                                        </span>
                                        {isOccupied && 
                                            <span className="block text-xs text-red-500">
                                                Помещение уже забронировано
                                            </span>
                                        }
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 
                                            border-b border-l rotate-45"
                                        ></div>
                                    </div>

                                    {/* Кнопка слота */}
                                    <button
                                        disabled={isOccupied}
                                        onClick={() => dispatch({type: 'TOGGLE_SLOT', payload: slot})}
                                        className={`w-full p-2 flex flex-col justify-center items-center
                                            border border-gray-300 hover:border-indigo-500 rounded-lg hover:disabled:border-gray-300
                                            ${isSelected ? "bg-indigo-700 border-indigo-700 text-white" 
                                                :"bg-white hover:bg-gray-100"} disabled:bg-gray-100
                                            cursor-pointer transition-colors duration-200`}
                                    >
                                        <span className={`text-sm ${isSelected ? 'text-white' : 'text-black'} font-semibold group-disabled:text-gray-500`}>
                                            {slot.time.split('-')[0]}
                                        </span>
                                        <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'} group-disabled:text-gray-300`}>
                                            {isOccupied ? 'Занят' : isSelected ? 'В черновике': 'Свободен'}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>            

            <div className="flex flex-col gap-6">
                <div>
                    <div className="w-full p-4 border rounded-xl
                        bg-linear-to-br from-indigo-800 to-indigo-950"
                    >
                        <h3 className="text-white text-xs uppercase font-semibold mb-1 tracking-wider">
                            Ваш лимит
                        </h3>
                        <p className="text-sm text-white mb-4">
                            {user.department}
                        </p>
                        <div>
                            <span className="text-white text-2xl font-semibold tracking-wide">
                                {user.monthlyHoursLimit - user.usedHours}
                                </span>
                            <span className="text-white text-xs tracking-wide">
                                /{user.monthlyHoursLimit} ч. осталось
                                </span>
                        </div>
                    </div>
                </div>
                
                <div className="w-full p-6 flex flex-col gap-4
                    bg-white border border-gray-100 shadow-sm rounded-xl"
                >
                    <div>
                        <h2 className="w-full flex justify-between items-center text-lg font-bold mb-4">
                            Черновик 
                            <span className="text-xs text-gray-500 py-1 px-2 bg-gray-100 rounded-full">
                                Слотов: {state.selectedSlots.length} 
                            </span>
                        </h2>
                        {state.selectedSlots.length === 0 ? (
                            <div className="block w-full text-center h-40 content-center text-sm text-gray-400">
                                Выберите доступные слоты времени на таймере слева
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {state.selectedSlots.map(slot => (
                                    <div key={slot.id}
                                        className="w-full flex justify-between items-center py-2 px-4
                                        bg-gray-50 border border-gray-100 rounded-lg"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold tracking-wider text-black">
                                                {slot.time}
                                            </p>
                                            <p className="text-xs text-gray-500 ">
                                                Расход: {slot.priceHours} ч.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => dispatch({type: 'TOGGLE_SLOT', payload: slot})}
                                            className="text-xs text-gray-500 font-semibold cursor-pointer
                                            hover:text-red-500 transition-colors duration-300 ease-in-out"
                                        >
                                            Удалить 
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-full flex justify-evenly items-center gap-6 flex-wrap
                        border-t border-gray-100 pt-4"
                    >
                        <div className="min-w-50 flex justify-between items-baseline grow ">
                            <span className="text-sm text-gray-500 font-semibold">
                                Итого к списанию:
                            </span>
                            <span className="text-lg text-indigo-600 font-bold">
                                {totalHoursRequested} ч.
                            </span>
                        </div>
                        <button
                            disabled={state.selectedSlots.length === 0}
                            onClick={handleConfirmBooking}
                            className="min-w-55 px-4 py-2 grow bg-white not-disabled:hover:bg-indigo-600 
                            not-disabled:cursor-pointer border-2 rounded-lg border-indigo-600 disabled:border-gray-300
                            font-semibold text-sm text-indigo-600  not-disabled:hover:text-white disabled:text-gray-300 
                            transition-colors duration-300"
                        >
                            Подтвердить бронирование
                        </button>
                        {bookingMessage && (
                            <div className="w-full py-2 px-4 bg-indigo-600 rounded-xl
                                text-center text-sm text-white font-semibold">
                                {bookingMessage.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
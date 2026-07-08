import { useState, useEffect, useRef } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

interface FilterState {
    search: string;
    date: string;
    type: 'all' | 'desk' | 'room';
    floor: 'all' | number;
    hasFlipchart: boolean;
    hasTypeC: boolean;
}

interface BookingFiltersProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const BookingFilters: React.FC<BookingFiltersProps> = ({ filters, setFilters }) => {
    const searchInput = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isFloorOpen, setIsFloorOpen] = useState(false);


    useEffect(() => {
        if (searchInput.current) {
            searchInput.current.focus();
        }
    }, []);
    useClickOutside(dropdownRef, () => setIsFloorOpen(false));

    const handleInputChangle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({...prev, search: e.target.value}));
    };

    const handleChackboxChange = (field: 'hasFlipchart' | 'hasTypeC') => {
        setFilters(prev => ({...prev, [field]: !prev[field]}));
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({...prev, date: e.target.value}));
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 
            grid grid-cols-1 md:grid-cols-3 gap-4"
        >
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                    Поиск ресурса
                </label>
                <input 
                    ref={searchInput}
                    type='text'
                    value={filters.search}
                    onChange={handleInputChangle}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                    Дата бронирования
                </label>
                <input 
                    type='date'
                    value={filters.date}
                    onChange={handleDateChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                    Тип ресурса
                </label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(['all', 'desk', 'room'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilters(prev => ({...prev, type: t}))}
                            className={`flex-1 text-sm dont-medium py-1.5 rounded-md transition-colors
                                ${filters.type === t 
                                    ? 'bg-white color-text-gray-900' 
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {t === 'all' ? 'Все' : t === 'desk' ? 'Места' : 'Комнаты'}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={dropdownRef} className="relative flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                    Этаж
                </label>
                <button
                    onClick={() => setIsFloorOpen(!isFloorOpen)}
                    className="w-full text-left px-4 py-2 border border-gray-200 rounded-lg bg-white
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                        flex justify-between items-center"
                >
                    <span>{filters.floor === 'all' ? 'Все этажи' : `${filters.floor}`}</span>
                </button>
                {isFloorOpen && (
                    <div className="absolute top-[100%] left-0 w-full mt-1 bg-white border border-gray-200
                        rounded-lg z-10 py-1">
                        {['all', 1, 2, 3].map((floor) => (
                            <button
                                key={floor}
                                onClick={() => {
                                    setFilters(prev => 
                                        ({...prev, floor: floor as 'all' | 1 | 2 | 3})
                                    );
                                    setIsFloorOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray"
                            >   
                                {floor === 'all' ? 'Все этажи' : `${floor}`}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-6 mt-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase">
                    <input 
                        type='checkbox'
                        checked={filters.hasFlipchart}
                        onChange={() => handleChackboxChange('hasFlipchart')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded 
                            focus:ring-indigo-500"
                    />
                    Есть флипчарт
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase">
                    <input 
                        type='checkbox'
                        checked={filters.hasTypeC}
                        onChange={() => handleChackboxChange('hasTypeC')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded 
                            focus:ring-indigo-500"
                    />
                    Type-C монитор 
                </label>
            </div>
        </div>
    );
};
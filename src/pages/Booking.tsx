import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { mockResources, Resource } from "../mockData/mockData";
import { BookingFilters } from "../components/BookingFilters";
import { ResourceCard } from "../components/ResourceCard";
import { SkeletonCard } from "../components/SkeletonCard";

export const Booking: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        search: '',
        date: new Date().toISOString().split('T')[0],
        type: 'all' as 'all' | 'desk' | 'room',
        floor: 'all' as 'all' | number,
        hasFlipchart: false,
        hasTypeC: false
    });
    
    const { data: resources, loading, error } = useFetch<Resource>(
        () => mockResources, [filters.date, filters.type]
    );

    const filteredResources = useMemo(() => {
        if (!resources) return [];
        return resources.filter(res => {
            const matchesSearch = res.name.toLowerCase().includes(filters.search.toLowerCase());
            const matchesType = filters.type === 'all' || res.type === filters.type;
            const matchesFloor = filters.floor === 'all' || res.floor === filters.floor;
            const matchesFlipcart = !filters.hasFlipchart || res.features.includes('Флипчарт');
            const matchesTypeC = !filters.hasTypeC || res.features.includes('Type-C монитор');

            return matchesSearch && matchesType && matchesFloor && matchesFlipcart && matchesTypeC;
        })
    }, [resources, filters]);
    
    const handleSelectResource = (id: string) => {
        navigate(`/resource/${id}`);
    };

    const [shouldCrash, setShouldCrash] = useState(false);
    if (shouldCrash) {
        throw new Error('Симуляция сбоя');
    }


    return (
        <div className="container">
            <div className="mb-6">
                <h1
                    className="text-2xl font-bold text-black mb-2 tracking-tight"
                >
                    Рабочее пространство
                </h1>
                <p className="text-gray-700 text-sm mb-2">
                    Используйте фильтры для быстрого поиска и бронирования шеринг-зон офиса
                </p>
                <button 
                    onClick={() => setShouldCrash(true)}
                    className="py-1 px-2 bg-red-300 hover:bg-red-400 text-red-800 text-sm rounded-md"
                >
                    Тест сбоя
                </button>
            </div>
            <BookingFilters filters={filters} setFilters={setFilters} />
            {error && (<div>{error}</div>)}
            {loading ? (<SkeletonCard />) : (
                <div className="flex flex-col gap-2">
                    <div className="text-sm font-semibold text-gray-700">
                        Найдено доступных ресурсов: {filteredResources.length}
                    </div>
                    {filteredResources.length === 0 ? (
                        <div className="w-full bg-white border border-dashed border-gray-100 p-8 rounded-xl mt-4
                            text-sm text-gray-400 text-center font-semibold"
                        >
                            По запросу ничего не найдено
                        </div>
                    ) : (
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr"
                        >
                            {filteredResources.map(res => (
                                <ResourceCard 
                                    key={res.id}
                                    resource={res}
                                    onSelectResource={handleSelectResource}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
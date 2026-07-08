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
            <div>
                <h1>Рабочее пространство</h1>
                <button onClick={() => setShouldCrash(true)}>
                    Тест сбоя
                </button>
            </div>
            <BookingFilters filters={filters} setFilters={setFilters} />
            {error && (<div>{error}</div>)}
            {loading ? (<SkeletonCard />) : (
                <div>
                    <div>Найдено ресурсов: {filteredResources.length}</div>
                    {filteredResources.length === 0 ? (
                        <div>По запросу ничего не найдено</div>
                    ) : (
                        <div>
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
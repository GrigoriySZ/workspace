import { useState, useEffect } from "react";

export function useFetch<T>(fetchFn: () => T[], dependencies: React.DependencyList = []){
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);  // Индикатор загрузки
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        const loadData = async () => {
            try {
                const result = fetchFn();
                if (isMounted) {
                    setData(result);
                    setLoading(false);
                }
            }
            catch {
                if (isMounted) {
                    setError('Ну удалось загрузить данные');
                    setLoading(false);
                }
            }
        };
        loadData();

        return () => {
            isMounted = false;
        }
    }, [fetchFn, ...dependencies]);

    return { data, loading, error };
}
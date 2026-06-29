export interface Resource {
    id: string;
    name: string;
    type: 'desk' | 'room';
    floor: number;
    features: string[];
}

export const mockResources: Resource[] = [
    {
        id: '1',
        name: 'Desk A-1',
        type: 'desk',
        floor: 2,
        features: ['Type-C монитор']
    }, {
        id: '2',
        name: 'Переговорная Альфа',
        type: 'room',
        floor: 3,
        features: ['Проектор', 'Маркерная достка', 'Флипчарт']
    }
]
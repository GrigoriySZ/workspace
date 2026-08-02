import { ActionButton } from "./ActionButton";
import { Resource } from "../mockData/mockData";

interface ResourceCardProps {
    resource: Resource;
    onSelectResource: (id: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelectResource }) => {
    return (
        <div
            onClick={() => onSelectResource(resource.id)}
            className="shadow-sm border border-gray-100 rounded-xl overflow-hidden"
        >
            <div className="relative min-h-24 bg-gray-300">
                <span className={`
                    absolute top-4 right-4
                    text-white text-xs font-bold py-1 px-2 rounded-full
                    ${resource.type === 'room' ? "bg-green-700" : "bg-purple-700"} 
                `}
                >
                    {resource.type === 'room' ? 'Переговорная' : 'Рабочее место'}
                </span>
            </div>
            <div className="flex flex-col bg-white p-4 gap-4">
                <div>
                    <h3 className="text-lg text-black font-bold ">
                        {resource.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-semibold mb-4">
                        Этаж {resource.floor}
                    </p>
                    <div
                        className="flex gap-2"
                    >
                        {resource.features.map(((feat, i) => (
                            <span key={i}
                                className="bg-gray-100 py-1 px-2 text-sm text-black rounded-md"
                            >
                                {feat}
                            </span>
                        )))}
                    </div>
                </div>
                <ActionButton  
                    onAction={() => onSelectResource(resource.id)}
                    label="Посмотреть расписание"
                />
            </div>
        </div>
    );
};
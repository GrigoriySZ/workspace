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
        >
            <div>
                <span>{resource.type === 'room' ? 'Переговорная' : 'Рабочее место'}</span>
            </div>
            <div>
                <div>
                    <h3>{resource.name}</h3>
                    <p>{resource.floor}</p>
                    <div>
                        {resource.features.map(((feat, i) => (
                            <span key={i}>
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
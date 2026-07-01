import React from "react";

interface ActionButtonProps{
    onAction: () => void;
    label: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onAction, label }) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onAction();
            }}
        >
            {label}
        </button>
    );
};
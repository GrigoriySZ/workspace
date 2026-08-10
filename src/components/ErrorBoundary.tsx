import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props{
    children: ReactNode;
};

interface State{
    hasError: boolean;
    error: Error | null;
};

export class ErrorBoundary extends Component<Props, State>{
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State{
        return {hasError: true, error};
    };

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Uncaught error:', error, errorInfo);
    };

    public handleReset = () => {
        localStorage.clear();  
        this.setState({hasError: false, error: null});  // Сбрасываем состояние
        window.location.href = '/';  // Обновляем страницу
    };

    public render(){
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full items-center justify-center">
                    <div className="flex flex-col justify-center gap-4
                        min-w-sm p-6 rounded-xl border border-gray-100 shadow-md"
                    >
                        <h2 className="text-red-500 text-2xl text-center font-bold">
                            Что-то пошло не так
                        </h2>
                        <p className="text-sm text-gray-500 text-center">
                            Произошла непредвиденная ошибка
                        </p>
                        <button
                            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg
                                text-white text-sm text-center"
                            onClick={this.handleReset}
                        >
                            Вернуться на главную страницу
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
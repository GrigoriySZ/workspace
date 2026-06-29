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
                <div>
                    <div>
                        <h2>Что-то пошло не так</h2>
                        <p>Произошла непредвиденная ошибка</p>
                        <button
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
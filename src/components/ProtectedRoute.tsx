import { Navigate, Outlet } from 'react-router-dom';
import { useStore, type KanbanState } from '../store/useStore';

export const ProtectedRoute = () => {
    const user = useStore((state: KanbanState) => state.user);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

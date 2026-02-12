import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SquareKanban } from 'lucide-react';

export default function LandingPage() {
    const [username, setUsername] = useState('');
    const login = useStore((state) => state.login);
    const user = useStore((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/board');
        }
    }, [user, navigate]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            login(username.trim());
            navigate('/board');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <SquareKanban className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome to Kanban
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please enter your username to continue
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <Input
                                id="username"
                                type="text"
                                required
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-12"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-semibold"
                            disabled={!username.trim()}
                        >
                            Start Planning
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

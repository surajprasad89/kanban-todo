export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id: string;
    title: string;
    status: Status;
    createdAt: number;
}

export interface User {
    username: string;
}

export interface ApiError {
    message: string;
}

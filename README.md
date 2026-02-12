# Kanban Board Application

A React-based Kanban Board with optimistic UI, drag-and-drop functionality, and persistent tasks.

## Features

-   **Drag & Drop**: Move tasks between columns (To Do, In Progress, Done).
-   **Optimistic UI**: Instant updates with background synchronization.
-   **Mock API**: Simulates server latency (1-2s) and random failures (20%) to test rollback logic.
-   **Notifications**: Toast messages for errors or failures.
-   **Persistence**: Tasks and login state are saved to localStorage.
-   **Protected Routes**: Requires login to access the board.

## Technologies

-   **React** (Vite)
-   **TypeScript**
-   **Tailwind CSS v4**
-   **Zustand** (State Management)
-   **dnd-kit** (Drag & Drop)
-   **Lucide React** (Icons)
-   **Sonner** (Toast Notifications)

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Usage

1.  Enter any username on the login screen.
2.  Add tasks using the input field.
3.  Drag tasks between columns.
4.  Delete tasks by hovering and clicking the trash icon.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import KanbanBoard from './pages/KanbanBoard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/board" element={<KanbanBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

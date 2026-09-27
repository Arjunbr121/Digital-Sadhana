import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
import { AppProvider } from './hooks/useAppData';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Chant from './pages/Chant';
import CreateSadhana from './pages/CreateSadhana';
import History from './pages/History';
import Home from './pages/Home';
import Login from './pages/Login';
import MantraDetail from './pages/MantraDetail';
import Mantras from './pages/Mantras';
import Meditate from './pages/Meditate';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Sankalpa from './pages/Sankalpa';

function Protected({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function Start() {
  const { user } = useAuth();
  return <Navigate to={user ? '/home' : '/login'} replace />;
}

export default function App() {
  return <AuthProvider><AppProvider><Routes>
    <Route path="/" element={<Start />} />
    <Route path="/login" element={<Login />} />
    <Route path="/chant/:mantraId" element={<Protected><Chant /></Protected>} />
    <Route element={<Protected><Shell /></Protected>}>
      <Route path="/home" element={<Home />} />
      <Route path="/mantras" element={<Mantras />} />
      <Route path="/mantras/:mantraId" element={<MantraDetail />} />
      <Route path="/sadhana/new" element={<CreateSadhana />} />
      <Route path="/sankalpa" element={<Sankalpa />} />
      <Route path="/meditate" element={<Meditate />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/history" element={<History />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
    <Route path="*" element={<Start />} />
  </Routes></AppProvider></AuthProvider>;
}

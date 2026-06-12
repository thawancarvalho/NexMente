import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Community from './pages/Community';
import Diary from './pages/Diary';
import EmotionalThermometer from './pages/EmotionalThermometer';
import Resources from './pages/Resources';
import About from './pages/About';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/comunidade" element={
              <ProtectedRoute><Community /></ProtectedRoute>
            } />
            <Route path="/diario" element={
              <ProtectedRoute><Diary /></ProtectedRoute>
            } />
            <Route path="/termometro" element={
              <ProtectedRoute><EmotionalThermometer /></ProtectedRoute>
            } />
            <Route path="/recursos" element={<Resources />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/ajuda" element={<Help />} />
            <Route path="/perfil" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute><Admin /></ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

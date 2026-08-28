import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/PHome/PHome';
import { ListagemPage } from '../pages/PListagem/PListagem';
import { LoginPage } from '../pages/PLogin/PLogin';
import { DetalhesPage } from '../pages/PDetalhes/PDetalhes';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/produtos" element={<ProtectedRoute><ListagemPage tipo="produtos" /></ProtectedRoute>} />
      <Route path="/categorias" element={<ProtectedRoute><ListagemPage tipo="categorias" /></ProtectedRoute>} />
      <Route path="/movimentacoes" element={<ProtectedRoute><ListagemPage tipo="movimentacoes" /></ProtectedRoute>} />
      <Route path="/detalhes/:tipo/:id" element={<ProtectedRoute><DetalhesPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

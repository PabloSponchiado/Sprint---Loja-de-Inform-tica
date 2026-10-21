import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app/routes';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

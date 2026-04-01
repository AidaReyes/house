import AppRouter from './routes/AppRouter';
import { loadTheme } from './utils/theme';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function App() {
  loadTheme();
  
  return <AppRouter />;
}
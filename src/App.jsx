import AppRouter from './routes/AppRouter';
import { loadTheme } from './utils/theme';

export default function App() {
  loadTheme();
  
  return <AppRouter />;
}